const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");

const storage =
  process.env.DB_STORAGE ||
  (process.env.NODE_ENV === "test"
    ? ":memory:"
    : path.join(__dirname, "../../data/glow.sqlite"));

if (storage !== ":memory:") {
  fs.mkdirSync(path.dirname(storage), { recursive: true });
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

module.exports = sequelize;
