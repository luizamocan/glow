const { Appointment, Service, Client } = require("../models");
const clientStore = require("./clientStore");

const toPlain = (model) => {
  if (!model) return null;
  const appointment = model.get({ plain: true });
  if (appointment.service && !appointment.serviceName) {
    appointment.serviceName = appointment.service.name;
  }
  return appointment;
};

const formatAppointment = (appointment) => {
  if (!appointment) return null;
  return {
    ...appointment,
    service: appointment.service?.name || appointment.serviceName,
    price: appointment.service?.price || appointment.price,
    userEmail: appointment.client?.email || appointment.userEmail,
    clientName: appointment.client?.name,
  };
};

const withService = {
  include: [
    { model: Service, as: "service" },
    { model: Client, as: "client" },
  ],
  order: [["id", "ASC"]],
};

const getAll = async () => {
  const appointments = await Appointment.findAll(withService);
  return appointments.map(toPlain).map(formatAppointment);
};

const getById = async (id) =>
  formatAppointment(toPlain(await Appointment.findByPk(id, { include: withService.include })));

const getByEmail = async (email) => {
  const appointments = await Appointment.findAll({
    ...withService,
    include: [
      { model: Service, as: "service" },
      { model: Client, as: "client", where: { email } },
    ],
  });
  return appointments.map(toPlain).map(formatAppointment);
};

const getByServiceId = async (serviceId) => {
  const appointments = await Appointment.findAll({
    ...withService,
    where: { serviceId },
  });
  return appointments.map(toPlain).map(formatAppointment);
};

const countByServiceId = async (serviceId) => Appointment.count({ where: { serviceId } });

const create = async (data) => {
  const service = await Service.findByPk(data.serviceId);
  if (!service) return null;

  const client =
    data.clientId
      ? await clientStore.getById(data.clientId)
      : await clientStore.findOrCreateByEmail({
          email: data.userEmail,
          name: data.clientName,
          phone: data.clientPhone,
        });
  if (!client) return null;

  const appointment = await Appointment.create({
    serviceId: data.serviceId,
    clientId: client.id,
    date: data.date,
    time: data.time,
    status: data.status || "Upcoming",
    rating: data.rating,
  });

  return getById(appointment.id);
};

const remove = async (id) => {
  const deletedCount = await Appointment.destroy({ where: { id } });
  return deletedCount > 0;
};

const updateStatus = async (id, status) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) return null;
  await appointment.update({ status });
  return getById(id);
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  create,
  remove,
  getByServiceId,
  countByServiceId,
  updateStatus,
};
