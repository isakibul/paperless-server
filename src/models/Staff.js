const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Staff = sequelize.define(
  "Staff",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "departments",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Full name is required" },
      },
    },

    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Username is required" },
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
        len: {
          args: [6, 255],
          msg: "Password must be between 6 and 255 characters",
        },
      },
    },

    role: {
      type: DataTypes.ENUM("Head", "Staff"),
      allowNull: false,
      defaultValue: "Staff",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "staffs",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["departmentId", "username"],
      },
    ],
  }
);

module.exports = Staff;
