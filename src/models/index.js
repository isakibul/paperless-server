const Organization = require("./Organization");
const Department = require("./Department");
const Staff = require("./Staff");

/**
 * Department → Staff (1-M) Association)
 */
Department.hasMany(Staff, {
  foreignKey: "deptId",
  as: "staffs",
});

Staff.belongsTo(Department, {
  foreignKey: "deptId",
  as: "department",
});

module.exports = {
  Organization,
  Department,
  Staff,
};
