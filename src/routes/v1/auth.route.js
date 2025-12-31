const router = require("express").Router();
const { authControllers } = require("../../api/v1/auth");
const { authOrganization, authDepartment } = require("../../middlewares");

/**
 * auth routes
 */
router.post("/organization-register", authControllers.organizationRegister);
router.post("/organization-login", authControllers.organizationLogin);

router.post(
  "/department-register",
  authOrganization,
  authControllers.departmentRegister
);
router.post("/department-login", authControllers.departmentLogin);

router.post("/staff-register", authDepartment, authControllers.registerStaff);
router.post("/staff-login", authControllers.staffLogin);

module.exports = router;
