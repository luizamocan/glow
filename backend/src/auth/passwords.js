const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
};

const verifyPassword = async (password, storedPassword) => {
  if (!storedPassword) return false;

  const [algorithm, salt, hash] = storedPassword.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) {
    return password === storedPassword;
  }

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(hash, "hex");
  return storedKey.length === derivedKey.length && crypto.timingSafeEqual(storedKey, derivedKey);
};

const isPasswordHash = (storedPassword) => String(storedPassword || "").startsWith("scrypt$");

module.exports = { hashPassword, verifyPassword, isPasswordHash };
