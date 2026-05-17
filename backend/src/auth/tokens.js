const crypto = require("crypto");

const TOKEN_TTL_MS = Number(process.env.AUTH_TOKEN_TTL_MS || 2 * 60 * 60 * 1000);
const INACTIVITY_TIMEOUT_MS = Number(process.env.AUTH_INACTIVITY_MS || 15 * 60 * 1000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-this-secret-before-lab";
const sessions = new Map();

const base64url = (value) => Buffer.from(value).toString("base64url");

const sign = (payload) =>
  crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("base64url");

const issueToken = (user) => {
  const now = Date.now();
  const sessionId = crypto.randomUUID();
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.roleName || user.role,
    permissions: user.permissions || [],
    sid: sessionId,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + TOKEN_TTL_MS) / 1000),
  };

  const encodedHeader = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`);
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;

  sessions.set(sessionId, {
    userId: user.id,
    email: user.email,
    role: payload.role,
    permissions: payload.permissions,
    expiresAt: now + TOKEN_TTL_MS,
    lastActiveAt: now,
  });

  return { token, expiresAt: new Date(now + TOKEN_TTL_MS).toISOString(), inactivityTimeoutMs: INACTIVITY_TIMEOUT_MS };
};

const verifyToken = (token) => {
  const [encodedHeader, encodedPayload, signature] = String(token || "").split(".");
  if (!encodedHeader || !encodedPayload || !signature) return null;
  const expected = sign(`${encodedHeader}.${encodedPayload}`);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  const now = Date.now();
  if (!payload.exp || payload.exp * 1000 <= now) return null;

  const session = sessions.get(payload.sid);
  if (!session) return null;
  if (session.expiresAt <= now || now - session.lastActiveAt > INACTIVITY_TIMEOUT_MS) {
    sessions.delete(payload.sid);
    return null;
  }

  session.lastActiveAt = now;
  return {
    id: payload.sub,
    email: payload.email,
    roleName: payload.role,
    role: payload.role === "user" ? "client" : payload.role,
    permissions: payload.permissions || [],
    sessionId: payload.sid,
  };
};

const revokeSession = (sessionId) => {
  if (sessionId) sessions.delete(sessionId);
};

module.exports = { issueToken, verifyToken, revokeSession, INACTIVITY_TIMEOUT_MS };
