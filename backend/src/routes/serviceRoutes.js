const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/serviceController");
const { getServiceAppointments, getServiceAppointmentCount, updateAppointmentStatus } = require("../controllers/serviceController");

router.get   ("/statistics", ctrl.getStatistics);
router.get   ("/",           ctrl.getAllServices);
router.get   ("/:id",        ctrl.getServiceById);
router.post  ("/",           ctrl.createService);
router.put   ("/:id",        ctrl.updateService);
router.delete("/:id",        ctrl.deleteService);

router.get ("/:id/appointments", getServiceAppointments);
router.get ("/:id/appointment-count", getServiceAppointmentCount);
router.put ("/:id/appointments/:appId/status", updateAppointmentStatus);

module.exports = router;