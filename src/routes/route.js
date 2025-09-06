const router = require("express").Router();
const { authControllers } = require("../api/v1/auth");

router.get(
  "/api/v1/auth/organization-register",
  authControllers.organizationRegister
);

module.exports = router;
