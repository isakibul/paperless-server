const { sequelize } = require("../config/db");

const Role = require("./role.model");
const Department = require("./department.model");
const User = require("./user.model");
const Signature = require("./signature.model");
const File = require("./file.model");
const Document = require("./document.model");
const DocumentRoute = require("./documentRoute.model");
const Approval = require("./approval.model");
const Notification = require("./notification.model");
const AuditLog = require("./auditLog.model");

/**
 * Associations
 */
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

Department.hasMany(User, { foreignKey: "department_id" });
User.belongsTo(Department, { foreignKey: "department_id" });

User.hasMany(File, { foreignKey: "created_by" });
File.belongsTo(User, { foreignKey: "created_by" });

Department.hasMany(File, { foreignKey: "department_id" });
File.belongsTo(Department, { foreignKey: "department_id" });

File.hasMany(Document, { foreignKey: "file_id" });
Document.belongsTo(File, { foreignKey: "file_id" });

User.hasMany(Document, { foreignKey: "created_by" });
Document.belongsTo(User, { foreignKey: "created_by" });

Document.hasMany(Approval, { foreignKey: "document_id" });
Approval.belongsTo(Document, { foreignKey: "document_id" });

User.hasMany(Signature, { foreignKey: "user_id" });
Signature.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  Role,
  Department,
  User,
  Signature,
  File,
  Document,
  DocumentRoute,
  Approval,
  Notification,
  AuditLog,
};
