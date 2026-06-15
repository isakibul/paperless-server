import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import env from "../../../../config/env";
import { Department, Organization, Staff } from "../../../../models";

/**
 * Zod schema for staff login
 */
const staffLoginSchema = z.object({
  organizationUsername: z.string().min(3, "Organization username is required"),
  departmentUsername: z.string().min(3, "Department username is required"),
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
});

/**
 * Staff login controller
 */
const staffLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    /**
     * Validate input
     */
    const validatedData = staffLoginSchema.parse(req.body);

    const organization = await Organization.findOne({
      where: { organizationUsername: validatedData.organizationUsername },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    const department = await Department.findOne({
      where: {
        organizationId: organization.id,
        departmentUsername: validatedData.departmentUsername,
      },
    });

    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    /**
     * Find staff by username inside the selected department
     */
    const staff = await Staff.findOne({
      where: {
        departmentId: department.id,
        username: validatedData.username,
      },
    });

    if (!staff) {
      res.status(404).json({ message: "Staff not found" });
      return;
    }

    if (!staff.isActive) {
      res.status(403).json({ message: "Staff account is inactive" });
      return;
    }

    /**
     * Compare password
     */
    const isMatch = await bcrypt.compare(
      validatedData.password,
      staff.password,
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
        id: staff.id,
        username: staff.username,
        role: staff.role,
        departmentId: staff.departmentId,
        organizationId: organization.id,
      },
      env.jwtSecret,
      { expiresIn: "7d" },
    );

    /**
     * Return staff info with department details
     */
    res.status(200).json({
      message: "Staff logged in successfully",
      data: {
        id: staff.id,
        username: staff.username,
        fullName: staff.fullName,
        role: staff.role,
        departmentId: staff.departmentId,
        departmentUsername: department.departmentUsername,
        departmentName: department.departmentName,
        organizationId: organization.id,
        organizationUsername: organization.organizationUsername,
        organizationName: organization.organizationName,
        token,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors:
          err.issues?.map((e) => ({
            field: e.path[0],
            message: e.message,
          })) || [],
      });
      return;
    }

    console.error("Staff Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default staffLogin;
