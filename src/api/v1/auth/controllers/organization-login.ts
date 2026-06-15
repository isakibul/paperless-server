import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import env from "../../../../config/env";
import { Organization } from "../../../../models";

/**
 * Zod schema for organization login
 */
const loginSchema = z.object({
  organizationUsername: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
});

/**
 * Organization login controller
 */
const organizationLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { organizationUsername, password } = loginSchema.parse(req.body);

    /**
     * Find organization by username
     */
    const organization = await Organization.findOne({
      where: { organizationUsername },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    /**
     * Generate JWT Token
     */
    const token = jwt.sign(
      {
        id: organization.id,
        organizationUsername: organization.organizationUsername,
      },
      env.jwtSecret,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      data: {
        id: organization.id,
        organizationUsername: organization.organizationUsername,
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

    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default organizationLogin;
