const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", ctrl.login);
router.post("/register", ctrl.register);
router.post("/google", ctrl.googleLogin);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);
router.get("/me", authenticateToken, ctrl.me);
router.post("/logout", authenticateToken, ctrl.logout);

module.exports = router;
