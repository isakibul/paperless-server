const router = require("express").Router();

const {
  getAllDepartments,
  deleteDepartment,
} = require("../../api/v1/organization");

/**
 * List all departments
 */
router.get("/departments", getAllDepartments);

/**
 * Delete department
 */
router.delete("/departments/:id", deleteDepartment);

module.exports = router;
