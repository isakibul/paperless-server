import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "AuditLog",
    {
      log_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: { type: DataTypes.INTEGER },
      document_id: { type: DataTypes.INTEGER },
      action: { type: DataTypes.STRING(100), allowNull: false },
      timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "audit_log",
      timestamps: false,
    }
  );
