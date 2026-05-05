const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(160),
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    tableName: "roles",
    underscored: true,
  }
);

module.exports = Role;
