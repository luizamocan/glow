const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.post("/login", ctrl.login);
router.post("/register", ctrl.register);
router.post("/password-recovery/request", ctrl.requestPasswordRecovery);
router.post("/password-recovery/reset", ctrl.resetPassword);
router.get("/me", requireAuth, ctrl.me);
router.post("/logout", requireAuth, ctrl.logout);

module.exports = router;
