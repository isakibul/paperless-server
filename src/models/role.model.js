import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Role",
    {
      role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
    },
    {
      tableName: "roles",
      timestamps: false,
    }
  );
