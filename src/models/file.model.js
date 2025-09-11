const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const File = sequelize.define(
  "File",
  {
    file_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    department_id: { type: DataTypes.INTEGER },
  },
  {
    tableName: "files",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = File;
