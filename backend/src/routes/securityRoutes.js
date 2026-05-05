const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/securityController");

router.get("/logs", ctrl.getLogs);
router.get("/observations", ctrl.getObservationList);

module.exports = router;
