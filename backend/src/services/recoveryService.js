const crypto = require("crypto");

const RESET_TTL_MS = 15 * 60 * 1000;
const resetTokens = new Map();

const createResetToken = (email) => {
  const token = crypto.randomBytes(16).toString("hex");
  resetTokens.set(token, {
    email,
    expiresAt: Date.now() + RESET_TTL_MS,
  });
  return {
    token,
    expiresAt: new Date(Date.now() + RESET_TTL_MS).toISOString(),
  };
};

const consumeResetToken = (token) => {
  const record = resetTokens.get(token);
  if (!record) return null;
  resetTokens.delete(token);
  if (record.expiresAt <= Date.now()) return null;
  return record.email;
};

module.exports = { createResetToken, consumeResetToken };
