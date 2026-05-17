const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    username: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "google_id",
    },
    authProvider: {
      type: DataTypes.ENUM("local", "google"),
      allowNull: false,
      defaultValue: "local",
      field: "auth_provider",
    },
    role: {
      type: DataTypes.ENUM("admin", "client"),
      allowNull: false,
      defaultValue: "client",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "client_id",
    },
  },
  {
    tableName: "users",
    underscored: true,
  }
);

module.exports = User;
