const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const FileContent = sequelize.define(
  "FileContent",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    fileId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    content: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "file_contents",
    timestamps: true,
  },
);

module.exports = FileContent;
