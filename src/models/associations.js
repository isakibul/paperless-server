const Organization = require("./Organization");
const Department = require("./Department");
const Staff = require("./Staff");
const File = require("./File");
const FileContent = require("./FileContent");
const FileDepartment = require("./FileDepartment");

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
      name: "departmentId",
      allowNull: false,
    },
    as: "staffs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Staff.belongsTo(Department, {
    foreignKey: {
      name: "departmentId",
      allowNull: false,
    },
    as: "department",
  });
}

File.hasOne(FileContent, { foreignKey: "fileId" });
FileContent.belongsTo(File, { foreignKey: "fileId" });

File.belongsToMany(Department, {
  through: FileDepartment,
  foreignKey: "fileId",
  as: "routedDepartments",
});

Department.belongsToMany(File, {
  through: FileDepartment,
  foreignKey: "departmentId",
  as: "receivedFiles",
});

// Direct association for easier eager loading
File.hasMany(FileDepartment, { foreignKey: "fileId", as: "fileDepartments" });
FileDepartment.belongsTo(File, { foreignKey: "fileId" });

// Also associate FileDepartment to Department for eager loading
FileDepartment.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "department",
});

module.exports = applyAssociations;
