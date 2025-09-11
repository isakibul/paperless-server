import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Notification",
    {
      notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      document_id: { type: DataTypes.INTEGER },
      message: { type: DataTypes.TEXT, allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "notifications",
      timestamps: false,
    }
  );
