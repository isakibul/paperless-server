import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Document",
    {
      document_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      file_id: { type: DataTypes.INTEGER, allowNull: false }, // NEW
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
      },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      department_id: { type: DataTypes.INTEGER },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "documents",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
