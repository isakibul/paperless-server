const { z } = require("zod");
const bcrypt = require("bcrypt");
const { Department } = require("../../../../models");

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
const registerDepartment = async (req, res) => {
  try {
    const validatedData = departmentSchema.parse(req.body);

    const organizationId = req.user.id;

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
      return res.status(409).json({
        message: "Department username already exists in your organization",
      });
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

    return res.status(201).json({
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
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }

    console.error("Department Registration Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = registerDepartment;
