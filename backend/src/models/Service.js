const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 480 },
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "services",
    underscored: true,
  }
);

module.exports = Service;
