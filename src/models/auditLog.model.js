const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AuditLog = sequelize.define(
  "AuditLog",
  {
    log_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING(255), allowNull: false },
    entity: { type: DataTypes.STRING(100), allowNull: false }, // e.g., "document"
    entity_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "audit_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = AuditLog;
