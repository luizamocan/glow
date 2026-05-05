const fs = require("fs");
const path = require("path");

const storagePath =
  process.env.CHAT_STORAGE ||
  path.join(__dirname, "../../data/chatMessages.json");

const ensureStorage = async () => {
  await fs.promises.mkdir(path.dirname(storagePath), { recursive: true });
  try {
    await fs.promises.access(storagePath);
  } catch (_) {
    await fs.promises.writeFile(storagePath, "[]", "utf8");
  }
};

const readAll = async () => {
  await ensureStorage();
  const raw = await fs.promises.readFile(storagePath, "utf8");
  try {
    const messages = JSON.parse(raw);
    return Array.isArray(messages) ? messages : [];
  } catch (_) {
    return [];
  }
};

const writeAll = async (messages) => {
  await ensureStorage();
  await fs.promises.writeFile(storagePath, JSON.stringify(messages, null, 2), "utf8");
};

const getRecent = async (limit = 50) => {
  const messages = await readAll();
  return messages.slice(-limit);
};

const create = async ({ userId, userName, userEmail, role, text }) => {
  const messages = await readAll();
  const cleanText = String(text || "").trim();
  if (!cleanText) return null;

  const message = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId: userId || null,
    userName: userName || "Guest",
    userEmail: userEmail || "",
    role: role || "user",
    text: cleanText.slice(0, 500),
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  await writeAll(messages.slice(-200));
  return message;
};

const reset = async () => {
  await writeAll([]);
};

module.exports = { getRecent, create, reset, storagePath };
