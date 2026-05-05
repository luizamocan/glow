const chatStore = require("../data/chatStore");

const getMessages = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  const messages = await chatStore.getRecent(limit);
  res.json(messages);
};

module.exports = { getMessages };
