const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Signature = sequelize.define(
  "Signature",
  {
    signature_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    signature_path: { type: DataTypes.STRING, allowNull: false }, // path to stored image/pdf
  },
  {
    tableName: "signatures",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Signature;
