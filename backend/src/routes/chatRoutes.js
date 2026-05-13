const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/chatController");
const { requirePermission } = require("../middleware/auth");

router.get("/messages", requirePermission("chat:use"), ctrl.getMessages);

module.exports = router;
