const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/securityController");
const { authenticateToken, requirePermission } = require("../middleware/authMiddleware");

router.use(authenticateToken, requirePermission("security:read"));
router.get("/logs", ctrl.getLogs);
router.get("/observations", ctrl.getObservationList);

module.exports = router;
