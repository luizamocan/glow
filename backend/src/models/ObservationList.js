const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const ObservationList = sequelize.define(
  "ObservationList",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    observedIdentity: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      field: "observed_identity",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "user_id",
    },
    userEmail: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "user_email",
    },
    groupId: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "unknown",
      field: "group_id",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium",
    },
    status: {
      type: DataTypes.ENUM("active", "reviewed"),
      allowNull: false,
      defaultValue: "active",
    },
    lastActionAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "last_action_at",
    },
  },
  {
    tableName: "observation_list",
    underscored: true,
  }
);

module.exports = ObservationList;
