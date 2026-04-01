import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";
import { Organization } from "../../../../models";

/**
 * Validation schema for creating a organization
 */
const organizationSchema = z.object({
  organizationUsername: z
    .string()
    .min(3, "Username must be at least 3 characters"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
  organizationType: z.string().min(2, "Type must be at least 2 characters"),
  about: z.string().max(1000).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 *
 * Register a new organization
 */
const organizationRegister = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = organizationSchema.parse(req.body);

    /**
     * Check if organization username already exists
     */
    const existingOrg = await Organization.findOne({
      where: { organizationUsername: validatedData.organizationUsername },
    });

    if (existingOrg) {
      res.status(409).json({ message: "Organization username already exists" });
      return;
    }

    /**
     * Hash password before storing
     */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const organization = await Organization.create({
      ...validatedData,
      password: hashedPassword,
    });

    /**
     * Success Response
     */
    res.status(201).json({
      message: "Organization registered successfully",
      data: {
        id: organization.id,
        organizationUsername: organization.organizationUsername,
        organizationName: organization.organizationName,
        organizationType: organization.organizationType,
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

    console.error("Registration Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default organizationRegister;
