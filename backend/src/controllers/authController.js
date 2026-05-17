const userStore = require("../data/userStore");
const { hashPassword, verifyPassword, isPasswordHash } = require("../auth/passwords");
const { issueToken, revokeSession } = require("../auth/tokens");

const withToken = (user) => {
  const { token, expiresAt, inactivityTimeoutMs } = issueToken(user);
  return { ...user, user, token, expiresAt, inactivityTimeoutMs };
};

const login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await userStore.getByEmailWithPassword(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (!isPasswordHash(user.password)) {
    await userStore.updatePassword(user.id, await hashPassword(password));
  }

  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };

  const { password: _password, ...safeUser } = user;
  res.json(withToken(safeUser));
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

  const user = await userStore.createClientUser({ name, email, password: await hashPassword(password), phone });
  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };
  res.status(201).json(withToken(user));
};

const me = (req, res) => {
  res.json({ user: req.user });
};

const logout = (req, res) => {
  revokeSession(req.user?.sessionId);
  res.status(204).send();
};

module.exports = { login, register, me, logout };
