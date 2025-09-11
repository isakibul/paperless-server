const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Approval = sequelize.define(
  "Approval",
  {
    approval_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    document_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    comments: { type: DataTypes.TEXT },
  },
  {
    tableName: "approvals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Approval;
