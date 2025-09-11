import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "File",
    {
      file_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      department_id: { type: DataTypes.INTEGER },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "files",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
