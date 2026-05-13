const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentController");
const { requirePermission } = require("../middleware/auth");

router.get("/", requirePermission("appointments:read"), ctrl.getAppointments);
router.post("/", requirePermission("appointments:create"), ctrl.createAppointment);
router.delete("/:id", requirePermission("appointments:delete"), ctrl.cancelAppointment);

module.exports = router;
