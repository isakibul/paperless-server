const { z } = require("zod");
const bcrypt = require("bcrypt");
const { Staff, Department } = require("../../../../models");

/**
 * Zod schema for staff registration
 */
const staffRegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Head", "Staff"]).optional(),
});

/**
 * Register Staff Controller
 */
const registerStaff = async (req, res) => {
  try {
    /**
     * Validate input
     */
    const validatedData = staffRegisterSchema.parse(req.body);
    const departmentId = req.user.id;

    console.log(departmentId);

    /**
     * Check department exists
     */
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    /**
     * Check username uniqueness inside department
     */
    const existingStaff = await Staff.findOne({
      where: {
        departmentId,
        username: validatedData.username,
      },
    });

    if (existingStaff) {
      return res
        .status(409)
        .json({ message: "Username already exists in this department" });
    }

    /**
     * Hash password
     */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    /**
     * Create staff
     */
    const staff = await Staff.create({
      departmentId: departmentId,
      fullName: validatedData.fullName,
      username: validatedData.username,
      password: hashedPassword,
      role: validatedData.role || "Staff",
    });

    return res.status(201).json({
      message: "Staff registered successfully",
      data: {
        id: staff.id,
        fullName: staff.fullName,
        username: staff.username,
        role: staff.role,
        departmentId: staff.departmentId,
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

    console.error("Staff Registration Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = registerStaff;
