import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface OrganizationAttributes {
  id: string;
  organizationUsername: string;
  organizationName: string;
  organizationType: string;
  about?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrganizationCreationAttributes extends Optional<
  OrganizationAttributes,
  "id" | "about"
> {}

class Organization
  extends Model<OrganizationAttributes, OrganizationCreationAttributes>
  implements OrganizationAttributes
{
  public id!: string;
  public organizationUsername!: string;
  public organizationName!: string;
  public organizationType!: string;
  public about?: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Organization.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    organizationUsername: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Organization username is required",
        },
      },
    },

    organizationName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Organization name is required",
        },
      },
    },

    organizationType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Organization type is required",
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
  },
  {
    tableName: "organizations",
    timestamps: true,
    sequelize,
  },
);

export default Organization;
