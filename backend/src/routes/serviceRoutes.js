const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/serviceController");
const { getServiceAppointments, getServiceAppointmentCount, updateAppointmentStatus } = require("../controllers/serviceController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

router.get   ("/statistics", authenticateToken, requireRole("admin"), ctrl.getStatistics);
router.get   ("/",           ctrl.getAllServices);
router.get   ("/:id",        ctrl.getServiceById);
router.post  ("/",           authenticateToken, requireRole("admin"), ctrl.createService);
router.put   ("/:id",        authenticateToken, requireRole("admin"), ctrl.updateService);
router.delete("/:id",        authenticateToken, requireRole("admin"), ctrl.deleteService);

router.get ("/:id/appointments", authenticateToken, requireRole("admin"), getServiceAppointments);
router.get ("/:id/appointment-count", authenticateToken, requireRole("admin"), getServiceAppointmentCount);
router.put ("/:id/appointments/:appId/status", authenticateToken, requireRole("admin"), updateAppointmentStatus);

module.exports = router;
