const userStore = require("../data/userStore");
const {
  createToken,
  hashPassword,
  isHashedPassword,
  verifyPassword,
} = require("../services/authService");

const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^a-zA-Z0-9]/.test(password);

const authResponse = (user) => {
  const { password: _password, ...safeUser } = user;
  const tokenDetails = createToken(safeUser);
  return { user: safeUser, ...tokenDetails };
};

const login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await userStore.getByEmailWithPassword(email);
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (!isHashedPassword(user.password)) {
    await userStore.updatePassword(user.id, hashPassword(password));
  }

  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };

  res.json(authResponse(user));
};

const register = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const phone = req.body.phone ? String(req.body.phone).trim() : null;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required" });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters and include uppercase, number and special character",
    });
  }

  const existing = await userStore.getByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const user = await userStore.createClientUser({ name, email, password: hashPassword(password), phone });
  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };
  res.status(201).json(authResponse(user));
};

module.exports = { login, register };
