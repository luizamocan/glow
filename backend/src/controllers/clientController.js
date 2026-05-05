const store = require("../data/clientStore");
const { validateClient } = require("../validators/clientValidator");

const getClients = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const total = await store.count({ search });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const data = await store.getAll({ search, page, limit });

  res.json({ data, pagination: { page, limit, total, totalPages } });
};

const getClientById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const client = await store.getById(id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  res.json(client);
};

const createClient = async (req, res) => {
  const errors = validateClient(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const email = req.body.email.trim().toLowerCase();
  const existing = await store.getByEmail(email);
  if (existing) return res.status(409).json({ errors: ["A client with this email already exists"] });

  const client = await store.create({
    name: req.body.name.trim(),
    email,
    phone: req.body.phone ? String(req.body.phone).trim() : null,
  });

  res.status(201).json(client);
};

const updateClient = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const existing = await store.getById(id);
  if (!existing) return res.status(404).json({ error: "Client not found" });

  const errors = validateClient(req.body, true);
  if (errors.length > 0) return res.status(400).json({ errors });

  if (req.body.email) {
    const email = req.body.email.trim().toLowerCase();
    const duplicate = await store.getByEmail(email);
    if (duplicate && duplicate.id !== id) {
      return res.status(409).json({ errors: ["A client with this email already exists"] });
    }
  }

  const client = await store.update(id, {
    ...(req.body.name !== undefined && { name: req.body.name.trim() }),
    ...(req.body.email !== undefined && { email: req.body.email.trim().toLowerCase() }),
    ...(req.body.phone !== undefined && { phone: req.body.phone ? String(req.body.phone).trim() : null }),
  });

  res.json(client);
};

const deleteClient = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const deleted = await store.remove(id);
  if (!deleted) return res.status(404).json({ error: "Client not found" });

  res.status(204).send();
};

module.exports = { getClients, getClientById, createClient, updateClient, deleteClient };
