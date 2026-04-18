const store = require("../data/store");
const { validateService } = require("../validators/serviceValidator");

// GET /api/services?page=1&limit=4&search=facial
const getAllServices = (req, res) => {
  const page    = parseInt(req.query.page)   || 1;
  const limit   = parseInt(req.query.limit)  || 4;
  const search  = (req.query.search || "").toLowerCase();

  let services = store.getAll();

  // Filter by search
  if (search) {
    services = services.filter(s =>
      s.name.toLowerCase().includes(search)
    );
  }

  // Pagination
  const total      = services.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start      = (page - 1) * limit;
  const data       = services.slice(start, start + limit);

  res.json({
    data,
    pagination: { page, limit, total, totalPages },
  });
};

// GET /api/services/:id
const getServiceById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const service = store.getById(id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  res.json(service);
};

// POST /api/services
const createService = (req, res) => {
  const errors = validateService(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  // Check duplicate name
  const exists = store.getAll().find(
    s => s.name.toLowerCase() === req.body.name.trim().toLowerCase()
  );
  if (exists) return res.status(409).json({ errors: ["A service with this name already exists"] });

  const newService = store.create({
    name:        req.body.name.trim(),
    price:       req.body.price,
    duration:    req.body.duration,
    description: (req.body.description || "").trim(),
  });

  res.status(201).json(newService);
};

// PUT /api/services/:id
const updateService = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const existing = store.getById(id);
  if (!existing) return res.status(404).json({ error: "Service not found" });

  const errors = validateService(req.body, true);
  if (errors.length > 0) return res.status(400).json({ errors });

  // Check duplicate name (exclude current)
  if (req.body.name) {
    const duplicate = store.getAll().find(
      s => s.name.toLowerCase() === req.body.name.trim().toLowerCase() && s.id !== id
    );
    if (duplicate) return res.status(409).json({ errors: ["A service with this name already exists"] });
  }

  const updated = store.update(id, {
    ...(req.body.name        && { name: req.body.name.trim() }),
    ...(req.body.price       !== undefined && { price: req.body.price }),
    ...(req.body.duration    !== undefined && { duration: req.body.duration }),
    ...(req.body.description !== undefined && { description: req.body.description.trim() }),
  });

  res.json(updated);
};

// DELETE /api/services/:id
const deleteService = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const deleted = store.remove(id);
  if (!deleted) return res.status(404).json({ error: "Service not found" });

  res.status(204).send();
};

// GET /api/services/statistics
const getStatistics = (req, res) => {
  const services = store.getAll();
  const total    = services.length;

  if (total === 0) return res.json({ total: 0 });

  const avgPrice    = Math.round(services.reduce((s, x) => s + x.price, 0)    / total);
  const avgDuration = Math.round(services.reduce((s, x) => s + x.duration, 0) / total);
  const maxPrice    = Math.max(...services.map(s => s.price));
  const minPrice    = Math.min(...services.map(s => s.price));

  const priceTiers = {
    low:    services.filter(s => s.price <= 40).length,
    medium: services.filter(s => s.price > 40 && s.price <= 80).length,
    high:   services.filter(s => s.price > 80).length,
  };

  const durationBuckets = {
    "0-30 min":   services.filter(s => s.duration <= 30).length,
    "30-60 min":  services.filter(s => s.duration > 30 && s.duration <= 60).length,
    "60+ min":    services.filter(s => s.duration > 60).length,
  };

  res.json({ total, avgPrice, avgDuration, maxPrice, minPrice, priceTiers, durationBuckets });
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService, getStatistics };