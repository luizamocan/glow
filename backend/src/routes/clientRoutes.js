const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/clientController");
const { requirePermission } = require("../middleware/auth");

router.get("/", requirePermission("clients:read"), ctrl.getClients);
router.get("/:id", requirePermission("clients:read"), ctrl.getClientById);
router.post("/", requirePermission("clients:manage"), ctrl.createClient);
router.put("/:id", requirePermission("clients:manage"), ctrl.updateClient);
router.delete("/:id", requirePermission("clients:manage"), ctrl.deleteClient);

module.exports = router;
