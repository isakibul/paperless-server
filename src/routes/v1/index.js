const router = require("express").Router();
const authRoutes = require("./auth.route");
const departmentRoutes = require("./department.routes");
const fileRoutes = require("./");

router.use("/auth", authRoutes);
router.use("/department", departmentRoutes);
router.use("/file", fileRoutes);

module.exports = router;
