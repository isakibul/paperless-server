import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Department } from "../../../../models";

/**
 * Zod schema for department login
 */
const departmentLoginSchema = z.object({
  departmentUsername: z.string().min(2, "Department username is required"),
  password: z.string().min(6, "Password is required"),
});

/**
 * Department login controller
 */
const departmentLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    /**
     * Validate request body
     */
    const validatedData = departmentLoginSchema.parse(req.body);

    /**
     * Find department by username
     */
    const department = await Department.findOne({
      where: { departmentUsername: validatedData.departmentUsername },
    });

    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    /**
     * Check password
     */
    const isMatch = await bcrypt.compare(
      validatedData.password,
      department.password,
    );
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    /**
     * Generate JWT token
     */
    const token = jwt.sign(
      {
        id: department.id,
        departmentUsername: department.departmentUsername,
        organizationId: department.organizationId,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Department logged in successfully",
      data: {
        id: department.id,
        departmentUsername: department.departmentUsername,
        departmentName: department.departmentName,
        organizationId: department.organizationId,
        token,
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

    console.error("Department Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default departmentLogin;
