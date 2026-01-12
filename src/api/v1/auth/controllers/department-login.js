const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Department } = require("../../../../models");

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
const departmentLogin = async (req, res) => {
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
      return res.status(404).json({ message: "Department not found" });
    }

    /**
     * Check password
     */
    const isMatch = await bcrypt.compare(
      validatedData.password,
      department.password
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
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
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
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
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }

    console.error("Department Login Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = departmentLogin;
