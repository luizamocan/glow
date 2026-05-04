const serviceStore = require("../data/store");
const appointmentStore = require("../data/appointmentStore");

const resolvers = {
  Query: {
    services: (_, { page = 1, limit = 4, search = "" }) => {
      let all = serviceStore.getAll();
      if (search) {
        const q = search.toLowerCase();
        all = all.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            (s.description && s.description.toLowerCase().includes(q))
        );
      }
      const total = all.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const data = all.slice((page - 1) * limit, page * limit);
      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
        },
      };
    },


    service: (_, { id }) => serviceStore.getById(Number(id)),

    appointments: (_, { userEmail }) => {
      const all = appointmentStore.getAll();
      if (userEmail) return all.filter((a) => a.userEmail === userEmail);
      return all;
    },

    appointment: (_, { id }) => appointmentStore.getById(Number(id)),


    stats: () => {
      const services = serviceStore.getAll();
      const appointments = appointmentStore.getAll();

      const avgPrice =
        services.length === 0
          ? 0
          : services.reduce((sum, s) => sum + s.price, 0) / services.length;


      const countMap = {};
      appointments.forEach((a) => {
        countMap[a.serviceId] = (countMap[a.serviceId] || 0) + 1;
      });
      let mostBookedService = null;
      if (Object.keys(countMap).length > 0) {
        const topId = Object.entries(countMap).sort((a, b) => b[1] - a[1])[0][0];
        mostBookedService = serviceStore.getById(Number(topId));
      }

   
      const statusMap = {};
      appointments.forEach((a) => {
        statusMap[a.status] = (statusMap[a.status] || 0) + 1;
      });
      const appointmentsByStatus = Object.entries(statusMap).map(
        ([status, count]) => ({ status, count })
      );

      return {
        totalServices: services.length,
        totalAppointments: appointments.length,
        avgPrice,
        mostBookedService,
        appointmentsByStatus,
      };
    },
  },


  Service: {
    appointments: (parent) => {
      return appointmentStore
        .getAll()
        .filter((a) => Number(a.serviceId) === Number(parent.id));
    },
    appointmentCount: (parent) => {
      return appointmentStore
        .getAll()
        .filter((a) => Number(a.serviceId) === Number(parent.id)).length;
    },
  },

  Appointment: {
    service: (parent) => serviceStore.getById(Number(parent.serviceId)),
  },

  Mutation: {
    addService: (_, { input }) => {
      const errors = [];
      if (!input.name || input.name.trim().length < 2)
        errors.push("Name must be at least 2 characters");
      if (!input.price || input.price <= 0)
        errors.push("Price must be positive");
      if (!input.duration || input.duration <= 0)
        errors.push("Duration must be positive");
      if (errors.length > 0) throw new Error(errors.join(", "));
      return serviceStore.create(input);
    },

    editService: (_, { id, input }) => {
      const existing = serviceStore.getById(Number(id));
      if (!existing) throw new Error("Service not found");
      return serviceStore.update(Number(id), input);
    },

    deleteService: (_, { id }) => {
      const existing = serviceStore.getById(Number(id));
      if (!existing) throw new Error("Service not found");
      serviceStore.remove(Number(id));
      return true;
    },

   
    addAppointment: (_, { input }) => {
      const service = serviceStore.getById(Number(input.serviceId));
      if (!service) throw new Error("Service not found");
      return appointmentStore.create({
        ...input,
        serviceId: Number(input.serviceId),
        status: "Upcoming",
        rating: null,
      });
    },

    updateAppointmentStatus: (_, { id, status }) => {
      const existing = appointmentStore.getById(Number(id));
      if (!existing) throw new Error("Appointment not found");
      return appointmentStore.update(Number(id), { status });
    },

    cancelAppointment: (_, { id }) => {
      const existing = appointmentStore.getById(Number(id));
      if (!existing) throw new Error("Appointment not found");
      appointmentStore.remove(Number(id));
      return true;
    },

    rateAppointment: (_, { id, rating }) => {
      if (rating < 1 || rating > 5) throw new Error("Rating must be 1-5");
      const existing = appointmentStore.getById(Number(id));
      if (!existing) throw new Error("Appointment not found");
      return appointmentStore.update(Number(id), { rating });
    },
  },
};

module.exports = resolvers;
