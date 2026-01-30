const FileDepartment = require("../../../models/FileDepartment");
const File = require("../../../models/File");
const FileContent = require("../../../models/FileContent");
const Department = require("../../../models/Department");

const createFile = async (req, res) => {
  try {
    const {
      title,
      content,
      organizationId,
      departmentId,
      staffId,
      targetDepartments = [],
    } = req.body;

    console.log(req.body);

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // 1️⃣ Create file
    const file = await File.create({
      title,
      organizationId,
      departmentId,
      createdByStaffId: staffId,
    });

    // 2️⃣ Save content
    await FileContent.create({
      fileId: file.id,
      content,
    });

    // 3️⃣ Route to departments
    const routes = targetDepartments.map((depId) => ({
      fileId: file.id,
      departmentId: depId,
      canView: true,
      canEdit: false,
      canSign: false,
    }));

    // creator department gets edit
    routes.push({
      fileId: file.id,
      departmentId,
      canView: true,
      canEdit: true,
    });

    await FileDepartment.bulkCreate(routes);

    res.status(201).json({
      success: true,
      fileId: file.id,
    });
  } catch (error) {
    console.error("Create File Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create file",
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      include: [
        {
          model: FileContent,
          as: "FileContent",
        },
        {
          model: FileDepartment,
          as: "fileDepartments",
          include: [
            {
              model: Department,
              as: "department",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error("Get All Files Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch files",
    });
  }
};

module.exports = { createFile, getAllFiles };
