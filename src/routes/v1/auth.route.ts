import { Router } from "express";
import { authControllers } from "../../api/v1/auth";
import { authDepartment, authOrganization } from "../../middlewares";

const router = Router();

/**
 * auth routes
 */
router.post("/organization-register", authControllers.organizationRegister);
router.post("/organization-login", authControllers.organizationLogin);

router.post(
  "/department-register",
  authOrganization,
  authControllers.registerDepartment,
);
router.post("/department-login", authControllers.departmentLogin);

router.post("/staff-register", authDepartment, authControllers.registerStaff);
router.post("/staff-login", authControllers.staffLogin);

export default router;
