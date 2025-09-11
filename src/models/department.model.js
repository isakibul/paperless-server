import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Department",
    {
      department_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "departments",
      timestamps: false,
    }
  );
