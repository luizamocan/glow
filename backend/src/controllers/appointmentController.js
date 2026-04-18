const store = require("../data/appointmentStore");
const { validateAppointment } = require("../validators/appointmentValidator");

const getAppointments = (req, res) => {
  const email = req.query.email;
  // If email is provided, filter by user; otherwise, get all (for admin)
  const data = email ? store.getByEmail(email) : store.getAll();
  res.json(data);
};

const createAppointment = (req, res) => {
  const errors = validateAppointment(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const newApp = store.create({
    service: req.body.service,
    date: req.body.date,
    time: req.body.time,
    price: req.body.price,
    userEmail: req.body.userEmail
  });

  res.status(201).json(newApp);
};

const cancelAppointment = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = store.remove(id);
  if (!deleted) return res.status(404).json({ error: "Appointment not found" });
  res.status(204).send();
};

module.exports = { getAppointments, createAppointment, cancelAppointment };