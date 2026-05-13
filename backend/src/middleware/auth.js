const { verifyToken } = require("../auth/tokens");

const getBearerToken = (req) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return /^Bearer$/i.test(scheme) ? token : null;
};

const optionalAuth = (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) return next();

  try {
    const user = verifyToken(token);
    if (user) {
      req.user = user;
      res.locals.securityUser = {
        userId: user.id,
        userEmail: user.email,
        groupId: user.roleName || user.role,
      };
    }
  } catch (_) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  next();
};

const requirePermission = (permission) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  if (req.user.roleName === "admin" || req.user.permissions?.includes(permission)) return next();
  return res.status(403).json({ error: "Forbidden" });
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  if (roles.includes(req.user.roleName) || roles.includes(req.user.role)) return next();
  return res.status(403).json({ error: "Forbidden" });
};

module.exports = { optionalAuth, requireAuth, requirePermission, requireRole };
