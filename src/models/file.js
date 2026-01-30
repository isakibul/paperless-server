const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    createdByStaffId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "files",
    timestamps: true,
  },
);

module.exports = File;
