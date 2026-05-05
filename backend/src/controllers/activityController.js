const { getRecentActivity } = require("../nosql/activityLogger");
const { isMongoConnected } = require("../nosql/mongo");

const getActivity = async (req, res) => {
  const logs = await getRecentActivity({
    actionType: req.query.actionType,
    limit: parseInt(req.query.limit) || 100,
  });

  res.json({
    connected: isMongoConnected(),
    data: logs,
  });
};

module.exports = { getActivity };
