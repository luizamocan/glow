const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/securityController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

router.use(authenticateToken, requireRole("admin"));
router.get("/logs", ctrl.getLogs);
router.get("/observations", ctrl.getObservationList);

module.exports = router;
