const userStore = require("../data/userStore");
const {
  createToken,
  hashPassword,
  isHashedPassword,
  verifyPassword,
} = require("../services/authService");
const { verifyGoogleCredential } = require("../services/googleAuthService");
const { createResetToken, consumeResetToken } = require("../services/recoveryService");

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
  const identifier = String(req.body.identifier || req.body.email || req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!identifier || !password) {
    return res.status(400).json({ error: "Email/username and password are required" });
  }

  const user = await userStore.getByIdentifierWithPassword(identifier);
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
  const username = String(req.body.username || "").trim().toLowerCase();
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

  const user = await userStore.createClientUser({ name, email, username, password: hashPassword(password), phone });
  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };
  res.status(201).json(authResponse(user));
};

const googleLogin = async (req, res) => {
  const credential = String(req.body.credential || "").trim();
  if (!credential) {
    return res.status(400).json({ error: "Google credential is required" });
  }

  let googleProfile;
  try {
    googleProfile = await verifyGoogleCredential(credential);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  const googleId = googleProfile.googleId;
  const email = String(googleProfile.email || "").trim().toLowerCase();
  const name = String(googleProfile.name || "Google User").trim();

  if (!googleId || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Google account did not provide a valid email" });
  }

  let user = await userStore.getByGoogleId(googleId);
  if (!user) {
    user = await userStore.getByEmail(email);
  }
  if (!user) {
    user = await userStore.createGoogleUser({ name, email, googleId });
  }

  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };
  res.json(authResponse(user));
};

const me = async (req, res) => {
  const user = await userStore.getById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

const logout = async (_req, res) => {
  res.status(204).send();
};

const forgotPassword = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (email) {
    const user = await userStore.getByEmail(email);
    if (user) {
      const reset = createResetToken(email);
      return res.json({
        message: "If the email exists, a reset code was generated.",
        resetToken: reset.token,
        expiresAt: reset.expiresAt,
      });
    }
  }
  res.json({ message: "If the email exists, a reset code was generated." });
};

const resetPassword = async (req, res) => {
  const token = String(req.body.token || "").trim();
  const password = String(req.body.password || "");
  const email = consumeResetToken(token);

  if (!email) return res.status(400).json({ error: "Invalid or expired reset code" });
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters and include uppercase, number and special character",
    });
  }

  const user = await userStore.getByEmail(email);
  await userStore.updatePassword(user.id, hashPassword(password));
  res.json({ message: "Password reset successfully" });
};

module.exports = { forgotPassword, googleLogin, login, logout, me, register, resetPassword };
