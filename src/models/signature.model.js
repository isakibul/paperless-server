import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Signature",
    {
      signature_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      signature: { type: DataTypes.BLOB, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: "signatures",
      timestamps: false,
    }
  );
