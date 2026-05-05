const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const ActionLog = sequelize.define(
  "ActionLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      defaultValue: "anonymous",
      field: "group_id",
    },
    actionType: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: "action_type",
    },
    actionInformation: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "action_information",
    },
    method: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.STRING(240),
      allowNull: false,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status_code",
    },
    ipAddress: {
      type: DataTypes.STRING(80),
      allowNull: true,
      field: "ip_address",
    },
  },
  {
    tableName: "action_logs",
    underscored: true,
  }
);

module.exports = ActionLog;
