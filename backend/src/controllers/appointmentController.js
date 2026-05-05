const store = require("../data/appointmentStore");
const { validateAppointment } = require("../validators/appointmentValidator");

const getAppointments = async (req, res) => {
  const email = req.query.email;
  const data = email ? await store.getByEmail(email) : await store.getAll();
  res.json(data);
};

const createAppointment = async (req, res) => {
  const errors = validateAppointment(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const newApp = await store.create({
    service: req.body.service,
    serviceId: req.body.serviceId,
    clientId: req.body.clientId,
    clientName: req.body.clientName,
    clientPhone: req.body.clientPhone,
    date: req.body.date,
    time: req.body.time,
    price: req.body.price,
    userEmail: req.body.userEmail
  });
  if (!newApp) return res.status(404).json({ error: "Service not found" });

  res.status(201).json(newApp);
};

const cancelAppointment = async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await store.remove(id);
  if (!deleted) return res.status(404).json({ error: "Appointment not found" });
  res.status(204).send();
};

module.exports = { getAppointments, createAppointment, cancelAppointment };
