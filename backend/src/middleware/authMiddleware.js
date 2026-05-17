const { verifyToken } = require("../services/authService");

const normalizeRole = (role) => (role === "user" ? "client" : role);

const authenticateToken = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication token is required" });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      role: normalizeRole(payload.role),
      roleName: payload.role,
      permissions: payload.permissions || [],
    };
    res.locals.securityUser = {
      userId: req.user.id,
      userEmail: req.user.email,
      groupId: req.user.roleName || req.user.role,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message === "Token expired" ? "Session expired" : "Invalid token" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  const allowed = roles.map(normalizeRole);
  if (!req.user || !allowed.includes(normalizeRole(req.user.role))) {
    return res.status(403).json({ error: "You do not have permission to access this resource" });
  }
  return next();
};

const requirePermission = (permission) => (req, res, next) => {
  if (!req.user?.permissions?.includes(permission)) {
    return res.status(403).json({ error: "You do not have permission to access this resource" });
  }
  return next();
};

module.exports = { authenticateToken, requireRole, requirePermission };
