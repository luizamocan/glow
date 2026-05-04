let appointments = [
  { id: 1, service: "Manicure", serviceId: 3, date: "2024-03-10", time: "11:15 AM", price: 30, status: "Completed", rating: 5, userEmail: "client@glowandshine.com" },
];
let nextId = 2;

const getAll = () => appointments;

const getByEmail = (email) => appointments.filter(a => a.userEmail === email);

const getByServiceId = (serviceId) => appointments.filter(a => String(a.serviceId) === String(serviceId));

const countByServiceId = (serviceId) => appointments.filter(a => String(a.serviceId) === String(serviceId)).length;

const create = (data) => {
  const newApp = { id: nextId++, status: "Upcoming", ...data };
  appointments.push(newApp);
  return newApp;
};

const remove = (id) => {
  const index = appointments.findIndex(a => a.id == id);
  if (index === -1) return null;
  appointments.splice(index, 1);
  return true;
};

const updateStatus = (id, status) => {
  const app = appointments.find(a => a.id == id);
  if (!app) return null;
  app.status = status;
  return app;
};

module.exports = { getAll, getByEmail, create, remove ,getByServiceId, countByServiceId, updateStatus};