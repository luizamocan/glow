const ActivityLog = require("./ActivityLog");
const { isMongoConnected } = require("./mongo");

const parseActionInformation = (value) => {
  if (!value || typeof value !== "string") return value || {};
  try {
    return JSON.parse(value);
  } catch (_) {
    return { raw: value };
  }
};

const mirrorActionLog = async (log) => {
  if (!isMongoConnected()) return null;

  try {
    return await ActivityLog.create({
      userId: log.userId,
      userEmail: log.userEmail,
      groupId: log.groupId,
      actionType: log.actionType,
      actionInformation: parseActionInformation(log.actionInformation),
      method: log.method,
      endpoint: log.endpoint,
      statusCode: log.statusCode,
      ipAddress: log.ipAddress,
    });
  } catch (error) {
    console.warn("NoSQL activity mirror failed:", error.message);
    return null;
  }
};

const getRecentActivity = async ({ actionType, limit = 100 } = {}) => {
  if (!isMongoConnected()) return [];

  return ActivityLog.find({
    ...(actionType && { actionType }),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

module.exports = { mirrorActionLog, getRecentActivity };
