const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Document = sequelize.define(
  "Document",
  {
    document_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    file_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM("memo", "request", "notice"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "draft",
        "pending",
        "approved",
        "rejected",
        "archived"
      ),
      allowNull: false,
      defaultValue: "draft",
    },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    department_id: { type: DataTypes.INTEGER },
  },
  {
    tableName: "documents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Document;
