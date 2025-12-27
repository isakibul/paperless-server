const { z } = require("zod");
const bcrypt = require("bcrypt");
const { Organization } = require("../../../../models");

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

const organizationRegister = async (req, res) => {
  try {
    const validatedData = organizationSchema.parse(req.body);

    const existingOrg = await Organization.findOne({
      where: { organizationUsername: validatedData.organizationUsername },
    });

    if (existingOrg) {
      return res
        .status(409)
        .json({ message: "Organization username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const organization = await Organization.create({
      ...validatedData,
      password: hashedPassword,
    });

    return res.status(201).json({
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
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }

    console.error("Registration Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = organizationRegister;
