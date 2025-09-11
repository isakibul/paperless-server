const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const DocumentRoute = sequelize.define(
  "DocumentRoute",
  {
    route_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    document_id: { type: DataTypes.INTEGER, allowNull: false },
    from_department_id: { type: DataTypes.INTEGER, allowNull: false },
    to_department_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "document_routes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = DocumentRoute;
