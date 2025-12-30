const router = require("express").Router();
const { authControllers } = require("../../api/v1/auth");

/**
 * auth routes
 */
router.post("/organization-register", authControllers.organizationRegister);
router.post("/organization-login", authControllers.organizationLogin);

router.post("/department-register", authControllers.departmentRegister);
router.post("/department-login", authControllers.departmentLogin);

router.post("/staff-register", authControllers.registerStaff);
router.post("/staff-login", authControllers.staffLogin);

module.exports = router;
