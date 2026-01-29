const router = require("express").Router();
const authRoutes = require("./auth.route");
const departmentRoutes = require("./department.routes");

router.use("/auth", authRoutes);
router.use("/department", departmentRoutes);

module.exports = router;
