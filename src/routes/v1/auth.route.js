const router = require("express").Router();
const { authControllers } = require("../../api/v1/auth");

router.get("/organization-register", authControllers.organizationRegister);

module.exports = router;
