const Department = require("../../../models/Department");

/**
 * Get all departments
 */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Get Departments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
};

/**
 * Delete department
 */
exports.deleteDepartment = async (req, res) => {
  console.log("called");

  try {
    const { id } = req.params;
    console.log(id);

    const department = await Department.findByPk(id);

    console.log(department);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await department.destroy();

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete department",
    });
  }
};
