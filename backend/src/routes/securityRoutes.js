const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/securityController");
const { requireRole } = require("../middleware/auth");

router.get("/logs", requireRole("admin"), ctrl.getLogs);
router.get("/observations", requireRole("admin"), ctrl.getObservationList);

module.exports = router;
