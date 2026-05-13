const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/serviceController");
const { getServiceAppointments, getServiceAppointmentCount, updateAppointmentStatus } = require("../controllers/serviceController");
const { requirePermission } = require("../middleware/auth");

router.get   ("/statistics", requirePermission("statistics:read"), ctrl.getStatistics);
router.get   ("/",           ctrl.getAllServices);
router.get   ("/:id",        ctrl.getServiceById);
router.post  ("/",           requirePermission("services:create"), ctrl.createService);
router.put   ("/:id",        requirePermission("services:update"), ctrl.updateService);
router.delete("/:id",        requirePermission("services:delete"), ctrl.deleteService);

router.get ("/:id/appointments", requirePermission("appointments:read"), getServiceAppointments);
router.get ("/:id/appointment-count", requirePermission("appointments:read"), getServiceAppointmentCount);
router.put ("/:id/appointments/:appId/status", requirePermission("appointments:update"), updateAppointmentStatus);

module.exports = router;
