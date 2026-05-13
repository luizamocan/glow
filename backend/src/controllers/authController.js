const userStore = require("../data/userStore");
const { hashPassword, verifyPassword, isPasswordHash } = require("../auth/passwords");
const { issueToken, revokeSession } = require("../auth/tokens");
const {
  createLoginChallenge,
  verifyLoginChallenge,
  createPasswordResetChallenge,
  consumePasswordResetChallenge,
} = require("../auth/challenges");

const withToken = (user) => {
  const { token, expiresAt, inactivityTimeoutMs, permissionScheme, authLevel } = issueToken(user);
  return { ...user, user, token, expiresAt, inactivityTimeoutMs, permissionScheme, authLevel };
};

const login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const challengeId = String(req.body.challengeId || "");
  const oneTimeCode = req.body.oneTimeCode ? String(req.body.oneTimeCode).trim() : "";
  const recoveryCode = req.body.recoveryCode ? String(req.body.recoveryCode).trim() : "";

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

  const { password: _password, ...safeUser } = user;
  if (!challengeId) {
    const challenge = createLoginChallenge(safeUser);
    return res.status(202).json({
      requiresSecondFactor: true,
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt,
      delivery: "demo-response",
      oneTimeCode: challenge.oneTimeCode,
      recoveryCode: challenge.recoveryCode,
    });
  }

  if (!verifyLoginChallenge({ challengeId, user: safeUser, oneTimeCode, recoveryCode })) {
    return res.status(401).json({ error: "Invalid or expired authentication challenge" });
  }

  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };

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

const requestPasswordRecovery = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await userStore.getByEmail(email);
  if (!user) {
    return res.json({ message: "If the account exists, a recovery token was generated" });
  }

  const recovery = createPasswordResetChallenge(user);
  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };
  res.json({
    message: "Password recovery token generated",
    delivery: "demo-response",
    resetToken: recovery.resetToken,
    expiresAt: recovery.expiresAt,
  });
};

const resetPassword = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const resetToken = String(req.body.resetToken || "").trim();
  const newPassword = String(req.body.newPassword || "");

  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({ error: "Email, recovery token and new password are required" });
  }

  if (!consumePasswordResetChallenge({ email, resetToken })) {
    return res.status(401).json({ error: "Invalid or expired recovery token" });
  }

  const user = await userStore.getByEmail(email);
  if (!user) return res.status(404).json({ error: "Account not found" });

  await userStore.updatePassword(user.id, await hashPassword(newPassword));
  res.locals.securityUser = {
    userId: user.id,
    userEmail: user.email,
    groupId: user.roleName || user.role,
  };
  res.json({ message: "Password reset successfully" });
};

module.exports = { login, register, me, logout, requestPasswordRecovery, resetPassword };
