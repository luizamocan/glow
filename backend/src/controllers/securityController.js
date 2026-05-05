const securityService = require("../services/securityService");

const getLogs = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 300);
  res.json(await securityService.getLogs({ limit }));
};

const getObservationList = async (req, res) => {
  res.json(await securityService.getObservationList());
};

module.exports = { getLogs, getObservationList };
