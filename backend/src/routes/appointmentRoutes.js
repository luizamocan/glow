const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);
router.get("/", ctrl.getAppointments);
router.post("/", ctrl.createAppointment);
router.delete("/:id", ctrl.cancelAppointment);

module.exports = router;
