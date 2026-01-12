const Organization = require("./Organization");
const Department = require("./Department");
const Staff = require("./Staff");

function applyAssociations() {
  /**
   * Organization → Department (1-M) Association
   */
  Organization.hasMany(Department, {
    foreignKey: {
      name: "organizationId",
      allowNull: false,
    },
    as: "departments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Department.belongsTo(Organization, {
    foreignKey: {
      name: "organizationId",
      allowNull: false,
    },
    as: "organization",
  });

  /**
   * Department → Staff (1-M) Association
   */
  Department.hasMany(Staff, {
    foreignKey: {
      name: "deptId",
      allowNull: false,
    },
    as: "staffs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Staff.belongsTo(Department, {
    foreignKey: {
      name: "deptId",
      allowNull: false,
    },
    as: "department",
  });
}

module.exports = applyAssociations;
