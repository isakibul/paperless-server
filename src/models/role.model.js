const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Role = sequelize.define(
  "Role",
  {
    role_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

module.exports = Role;
