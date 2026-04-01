import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface StaffAttributes {
  id: string;
  departmentId: string;
  fullName: string;
  username: string;
  password: string;
  role: "Head" | "Staff";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StaffCreationAttributes extends Optional<
  StaffAttributes,
  "id" | "role" | "isActive"
> {}

class Staff
  extends Model<StaffAttributes, StaffCreationAttributes>
  implements StaffAttributes
{
  public id!: string;
  public departmentId!: string;
  public fullName!: string;
  public username!: string;
  public password!: string;
  public role!: "Head" | "Staff";
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Staff.init(
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
    sequelize,
  },
);

export default Staff;
