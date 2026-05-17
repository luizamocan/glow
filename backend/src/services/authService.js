const crypto = require("crypto");

const TOKEN_TTL_SECONDS = Number(process.env.JWT_TTL_SECONDS || 30 * 60);
const PASSWORD_PREFIX = "pbkdf2";
const HASH_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 32;
const HASH_DIGEST = "sha256";

const getJwtSecret = () =>
  process.env.JWT_SECRET || "glow-dev-secret-change-me-before-lab";

const base64UrlEncode = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const base64UrlDecode = (input) => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
};

const signPart = (data) =>
  crypto.createHmac("sha256", getJwtSecret()).update(data).digest("base64url");

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");
  return `${PASSWORD_PREFIX}$${HASH_ITERATIONS}$${salt}$${hash}`;
};

const isHashedPassword = (value) =>
  typeof value === "string" && value.startsWith(`${PASSWORD_PREFIX}$`);

const verifyPassword = (password, storedPassword) => {
  if (!storedPassword) return false;
  if (!isHashedPassword(storedPassword)) return password === storedPassword;

  const [, iterations, salt, expectedHash] = storedPassword.split("$");
  if (!iterations || !salt || !expectedHash) return false;

  const actualHash = crypto
    .pbkdf2Sync(password, salt, Number(iterations), HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"));
};

const createToken = (user) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: String(user.id),
    email: user.email,
    role: user.roleName || user.role || "client",
    permissions: user.permissions || [],
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const header = { alg: "HS256", typ: "JWT" };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  return {
    token: `${unsigned}.${signPart(unsigned)}`,
    expiresIn: TOKEN_TTL_SECONDS,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
  };
};

const verifyToken = (token) => {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("Malformed token");

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = signPart(unsigned);

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp <= now) throw new Error("Token expired");
  return payload;
};

module.exports = {
  TOKEN_TTL_SECONDS,
  createToken,
  hashPassword,
  isHashedPassword,
  verifyPassword,
  verifyToken,
};
