const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/chatController");

router.get("/messages", ctrl.getMessages);

module.exports = router;
