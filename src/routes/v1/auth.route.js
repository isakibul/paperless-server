const router = require("express").Router();
const { authControllers } = require("../../api/v1/auth");

router.post("/organization-register", authControllers.organizationRegister);
router.post("/organization-login", authControllers.organizationLogin);

module.exports = router;
