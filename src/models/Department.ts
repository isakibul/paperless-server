import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface DepartmentAttributes {
  id: string;
  organizationId: string;
  departmentUsername: string;
  departmentName: string;
  about?: string;
  password: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DepartmentCreationAttributes extends Optional<
  DepartmentAttributes,
  "id" | "about" | "isActive"
> {}

class Department
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  public id!: string;
  public organizationId!: string;
  public departmentUsername!: string;
  public departmentName!: string;
  public about?: string;
  public password!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Department.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "organizations",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    departmentUsername: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Department username is required",
        },
      },
    },

    departmentName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Department name is required",
        },
      },
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "About must be at most 1000 characters",
        },
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required",
        },
        len: {
          args: [6, 255],
          msg: "Password must be between 6 and 255 characters",
        },
      },
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "departments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["organizationId", "departmentUsername"],
      },
    ],
    sequelize,
  },
);

export default Department;
