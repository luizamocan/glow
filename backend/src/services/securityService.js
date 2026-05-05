const { Op } = require("sequelize");
const { ActionLog, ObservationList } = require("../models");
const { mirrorActionLog } = require("../nosql/activityLogger");

const WINDOW = {
  tenMinutes: 10 * 60 * 1000,
  fiveMinutes: 5 * 60 * 1000,
};

const getIdentity = ({ userId, userEmail, ipAddress }) => {
  if (userId) return `user:${userId}`;
  if (userEmail) return `email:${String(userEmail).toLowerCase()}`;
  return `ip:${ipAddress || "unknown"}`;
};

const getRequestUser = (req, res) => ({
  userId: res?.locals?.securityUser?.userId || (req.headers["x-user-id"] ? Number(req.headers["x-user-id"]) : null),
  userEmail: res?.locals?.securityUser?.userEmail || req.headers["x-user-email"] || req.body?.email || req.body?.userEmail || req.query?.email || null,
  groupId: res?.locals?.securityUser?.groupId || req.headers["x-user-role"] || req.headers["x-user-group"] || "anonymous",
});

const actionFromRequest = (req) => {
  const path = req.originalUrl.split("?")[0];
  if (path.includes("/auth/login")) return "auth.login";
  if (path.includes("/auth/register")) return "auth.register";
  if (path.includes("/chat")) return "chat.history";
  if (path.includes("/admin/start-gen")) return "admin.generator.start";
  if (path.includes("/admin/stop-gen")) return "admin.generator.stop";

  const resource = path.split("/").filter(Boolean).slice(1, 2)[0] || "unknown";
  const methodMap = {
    GET: "read",
    POST: "create",
    PUT: "update",
    PATCH: "update",
    DELETE: "delete",
  };
  return `${resource}.${methodMap[req.method] || req.method.toLowerCase()}`;
};

const buildActionInformation = (req, res) => {
  const bodyKeys = req.body && typeof req.body === "object" ? Object.keys(req.body) : [];
  return JSON.stringify({
    method: req.method,
    endpoint: req.originalUrl,
    statusCode: res.statusCode,
    params: req.params || {},
    query: req.query || {},
    bodyKeys,
  });
};

const flagObservation = async ({ log, reason, severity }) => {
  const observedIdentity = getIdentity(log);
  const existing = await ObservationList.findOne({ where: { observedIdentity } });

  if (existing) {
    await existing.update({
      reason,
      severity,
      status: "active",
      lastActionAt: new Date(),
      userId: log.userId,
      userEmail: log.userEmail,
      groupId: log.groupId,
    });
    return existing;
  }

  return ObservationList.create({
    observedIdentity,
    userId: log.userId,
    userEmail: log.userEmail,
    groupId: log.groupId,
    reason,
    severity,
    lastActionAt: new Date(),
  });
};

const countRecent = ({ log, since, where = {} }) =>
  ActionLog.count({
    where: {
      ...where,
      [Op.or]: [
        ...(log.userId ? [{ userId: log.userId }] : []),
        ...(log.userEmail ? [{ userEmail: log.userEmail }] : []),
        ...(!log.userId && !log.userEmail && log.ipAddress ? [{ ipAddress: log.ipAddress }] : []),
      ],
      createdAt: { [Op.gte]: since },
    },
  });

const evaluateSuspiciousBehavior = async (log) => {
  const now = Date.now();
  const tenMinutesAgo = new Date(now - WINDOW.tenMinutes);
  const fiveMinutesAgo = new Date(now - WINDOW.fiveMinutes);

  if (log.actionType === "auth.login" && log.statusCode === 401) {
    const failedLogins = await countRecent({
      log,
      since: tenMinutesAgo,
      where: { actionType: "auth.login", statusCode: 401 },
    });
    if (failedLogins >= 3) {
      await flagObservation({
        log,
        reason: `${failedLogins} failed login attempts in 10 minutes`,
        severity: "high",
      });
    }
  }

  if (log.method === "DELETE") {
    const deletes = await countRecent({
      log,
      since: fiveMinutesAgo,
      where: { method: "DELETE" },
    });
    if (deletes >= 3) {
      await flagObservation({
        log,
        reason: `${deletes} delete actions in 5 minutes`,
        severity: "high",
      });
    }
  }

  if (log.statusCode >= 400) {
    const failedRequests = await countRecent({
      log,
      since: tenMinutesAgo,
      where: { statusCode: { [Op.gte]: 400 } },
    });
    if (failedRequests >= 5) {
      await flagObservation({
        log,
        reason: `${failedRequests} failed or invalid requests in 10 minutes`,
        severity: "medium",
      });
    }
  }

  const rapidActions = await countRecent({ log, since: fiveMinutesAgo });
  if (rapidActions >= 20) {
    await flagObservation({
      log,
      reason: `${rapidActions} actions in 5 minutes`,
      severity: "medium",
    });
  }
};

const logAction = async ({ req, res, override = {} }) => {
  const requestUser = getRequestUser(req, res);
  const log = await ActionLog.create({
    userId: override.userId !== undefined ? override.userId : requestUser.userId,
    userEmail: override.userEmail !== undefined ? override.userEmail : requestUser.userEmail,
    groupId: override.groupId || requestUser.groupId,
    actionType: override.actionType || actionFromRequest(req),
    actionInformation: override.actionInformation || buildActionInformation(req, res),
    method: req.method,
    endpoint: req.originalUrl,
    statusCode: override.statusCode || res.statusCode,
    ipAddress: req.ip,
  });

  await mirrorActionLog(log.get({ plain: true }));
  await evaluateSuspiciousBehavior(log.get({ plain: true }));
  return log;
};

const recordAction = async ({
  userId = null,
  userEmail = null,
  groupId = "anonymous",
  actionType,
  actionInformation,
  method = "SYSTEM",
  endpoint = "websocket",
  statusCode = 200,
  ipAddress = null,
}) => {
  const log = await ActionLog.create({
    userId,
    userEmail,
    groupId,
    actionType,
    actionInformation: typeof actionInformation === "string" ? actionInformation : JSON.stringify(actionInformation || {}),
    method,
    endpoint,
    statusCode,
    ipAddress,
  });

  await mirrorActionLog(log.get({ plain: true }));
  await evaluateSuspiciousBehavior(log.get({ plain: true }));
  return log;
};

const actionLogger = (req, res, next) => {
  if (!req.originalUrl.startsWith("/api")) return next();

  res.on("finish", () => {
    logAction({ req, res }).catch((error) => {
      console.error("Action logging failed:", error);
    });
  });

  next();
};

const getLogs = async ({ limit = 100 } = {}) =>
  ActionLog.findAll({
    limit,
    order: [["createdAt", "DESC"]],
  }).then((rows) => rows.map((row) => row.get({ plain: true })));

const getObservationList = async () =>
  ObservationList.findAll({
    order: [["lastActionAt", "DESC"]],
  }).then((rows) => rows.map((row) => row.get({ plain: true })));

module.exports = {
  actionLogger,
  logAction,
  recordAction,
  getLogs,
  getObservationList,
  evaluateSuspiciousBehavior,
};
