const Organization = require("./Organization");
const Department = require("./Department");
const Staff = require("./Staff");

const applyAssociations = require("./associations");

applyAssociations();

module.exports = {
  Organization,
  Department,
  Staff,
};
