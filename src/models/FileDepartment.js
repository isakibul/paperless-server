const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const FileDepartment = sequelize.define(
  "FileDepartment",
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

    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    canView: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    canEdit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    canSign: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "file_departments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["fileId", "departmentId"],
      },
    ],
  },
);

module.exports = FileDepartment;
