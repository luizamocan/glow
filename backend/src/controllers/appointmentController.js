const store = require("../data/appointmentStore");
const { validateAppointment } = require("../validators/appointmentValidator");

const getAppointments = async (req, res) => {
  const isAdmin = req.user?.role === "admin";
  const email = isAdmin ? req.query.email : req.user.email;
  const data = email ? await store.getByEmail(email) : await store.getAll();
  res.json(data);
};

const createAppointment = async (req, res) => {
  const appointmentData = {
    ...req.body,
    userEmail: req.user.email,
  };
  const errors = validateAppointment(appointmentData);
  if (errors.length > 0) return res.status(400).json({ errors });

  const newApp = await store.create(appointmentData);
  if (!newApp) return res.status(404).json({ error: "Service not found" });

  res.status(201).json(newApp);
};

const cancelAppointment = async (req, res) => {
  const id = parseInt(req.params.id);
  const appointment = await store.getById(id);
  if (!appointment) return res.status(404).json({ error: "Appointment not found" });
  if (req.user.role !== "admin" && appointment.userEmail !== req.user.email) {
    return res.status(403).json({ error: "You can only cancel your own appointments" });
  }
  const deleted = await store.remove(id);
  if (!deleted) return res.status(404).json({ error: "Appointment not found" });
  res.status(204).send();
};

const updateAppointmentStatus = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can update appointment status" });
  }

  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const { status } = req.body;
  const validStatuses = ["Upcoming", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const updated = await store.updateStatus(id, status);
  if (!updated) return res.status(404).json({ error: "Appointment not found" });
  res.json(updated);
};

module.exports = { getAppointments, createAppointment, cancelAppointment, updateAppointmentStatus };
