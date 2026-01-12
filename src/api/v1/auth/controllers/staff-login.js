const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Staff, Department } = require("../../../../models");

/**
 * Zod schema for staff login
 */
const staffLoginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
});

/**
 * Staff login controller
 */
const staffLogin = async (req, res) => {
  try {
    /**
     * Validate input
     */
    const validatedData = staffLoginSchema.parse(req.body);

    /**
     * Find staff by username with department info
     */
    const staff = await Staff.findOne({
      where: { username: validatedData.username },
      include: {
        model: Department,
        as: "department",
        attributes: ["id", "departmentName", "organizationId"],
      },
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (!staff.isActive) {
      return res.status(403).json({ message: "Staff account is inactive" });
    }

    /**
     * Compare password
     */
    const isMatch = await bcrypt.compare(
      validatedData.password,
      staff.password
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
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
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    /**
     * Return staff info with department details
     */
    return res.status(200).json({
      message: "Staff logged in successfully",
      data: {
        id: staff.id,
        username: staff.username,
        fullName: staff.fullName,
        role: staff.role,
        departmentId: staff.departmentId,
        departmentName: staff.department.departmentName,
        organizationId: staff.department.organizationId,
        organizationName: staff.department.organizationName,
        token,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors:
          err.errors?.map((e) => ({
            field: e.path[0],
            message: e.message,
          })) || [],
      });
    }

    console.error("Staff Login Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = staffLogin;
