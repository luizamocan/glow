const userStore = require("../data/userStore");

const login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await userStore.getByEmailWithPassword(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _password, ...safeUser } = user;
  res.json(safeUser);
};

const register = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const phone = req.body.phone ? String(req.body.phone).trim() : null;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  const existing = await userStore.getByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const user = await userStore.createClientUser({ name, email, password, phone });
  res.status(201).json(user);
};

module.exports = { login, register };
