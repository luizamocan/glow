const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(180),
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    tableName: "permissions",
    underscored: true,
  }
);

module.exports = Permission;
