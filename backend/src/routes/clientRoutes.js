const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/clientController");
const { authenticateToken, requirePermission } = require("../middleware/authMiddleware");

router.use(authenticateToken, requirePermission("clients:manage"));
router.get("/", ctrl.getClients);
router.get("/:id", ctrl.getClientById);
router.post("/", ctrl.createClient);
router.put("/:id", ctrl.updateClient);
router.delete("/:id", ctrl.deleteClient);

module.exports = router;
