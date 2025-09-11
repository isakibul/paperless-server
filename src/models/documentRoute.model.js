import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "DocumentRoute",
    {
      route_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      document_id: { type: DataTypes.INTEGER, allowNull: false },
      step_number: { type: DataTypes.INTEGER, allowNull: false },
      approver_role_id: { type: DataTypes.INTEGER },
      is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "document_routes",
      timestamps: false,
      indexes: [{ unique: true, fields: ["document_id", "step_number"] }],
    }
  );
