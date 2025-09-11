import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Approval",
    {
      approval_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      document_id: { type: DataTypes.INTEGER, allowNull: false },
      approver_id: { type: DataTypes.INTEGER, allowNull: false },
      signature_id: { type: DataTypes.INTEGER },
      action: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      comments: { type: DataTypes.TEXT },
      action_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "approvals",
      timestamps: false,
    }
  );
