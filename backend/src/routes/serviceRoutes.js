const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/serviceController");
const { getServiceAppointments, getServiceAppointmentCount, updateAppointmentStatus } = require("../controllers/serviceController");
const { authenticateToken, requirePermission } = require("../middleware/authMiddleware");

router.get   ("/statistics", authenticateToken, requirePermission("statistics:read"), ctrl.getStatistics);
router.get   ("/",           ctrl.getAllServices);
router.get   ("/:id",        ctrl.getServiceById);
router.post  ("/",           authenticateToken, requirePermission("services:create"), ctrl.createService);
router.put   ("/:id",        authenticateToken, requirePermission("services:update"), ctrl.updateService);
router.delete("/:id",        authenticateToken, requirePermission("services:delete"), ctrl.deleteService);

router.get ("/:id/appointments", authenticateToken, requirePermission("appointments:read"), getServiceAppointments);
router.get ("/:id/appointment-count", authenticateToken, requirePermission("appointments:read"), getServiceAppointmentCount);
router.put ("/:id/appointments/:appId/status", authenticateToken, requirePermission("appointments:update"), updateAppointmentStatus);

module.exports = router;
