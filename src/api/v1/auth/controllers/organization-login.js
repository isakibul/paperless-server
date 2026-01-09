const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Organization } = require("../../../../models");

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
const organizationLogin = async (req, res) => {
  try {
    const { organizationUsername, password } = loginSchema.parse(req.body);

    /**
     * Find organization by username
     */
    const organization = await Organization.findOne({
      where: { organizationUsername },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    /**
     * Generate JWT Token
     */
    const token = jwt.sign(
      {
        id: organization.id,
        organizationUsername: organization.organizationUsername,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      data: {
        id: organization.id,
        organizationUsername: organization.organizationUsername,
        token,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }

    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = organizationLogin;
