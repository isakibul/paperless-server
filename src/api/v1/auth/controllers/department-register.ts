import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";
import { Department } from "../../../../models";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    organizationUsername: string;
  };
}

/**
 * Validation schema for creating a department
 */
const departmentSchema = z.object({
  departmentUsername: z
    .string()
    .min(3, "Username must be at least 3 characters"),
  departmentName: z
    .string()
    .min(2, "Department name must be at least 2 characters"),
  about: z.string().max(1000).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Register a new department under the authenticated organization
 */
const registerDepartment = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = departmentSchema.parse(req.body);

    const organizationId = req.user?.id;

    if (!organizationId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    /**
     * Check if department username already exists under this organization
     */
    const existingDept = await Department.findOne({
      where: {
        organizationId,
        departmentUsername: validatedData.departmentUsername,
      },
    });

    if (existingDept) {
      res.status(409).json({
        message: "Department username already exists in your organization",
      });
      return;
    }

    /**
     * Hash password before storing
     */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const department = await Department.create({
      ...validatedData,
      password: hashedPassword,
      organizationId,
    });

    res.status(201).json({
      message: "Department created successfully",
      data: {
        id: department.id,
        departmentUsername: department.departmentUsername,
        departmentName: department.departmentName,
        isActive: department.isActive,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
      return;
    }

    console.error("Department Registration Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default registerDepartment;
