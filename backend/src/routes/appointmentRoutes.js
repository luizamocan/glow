const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentController");

router.get("/", ctrl.getAppointments);
router.post("/", ctrl.createAppointment);
router.delete("/:id", ctrl.cancelAppointment);

module.exports = router;