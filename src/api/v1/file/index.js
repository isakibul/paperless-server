const File = require("../../../models/File");
const FileContent = require("../../../models/FileContent");

const createFile = async (req, res) => {
  console.log("calling");

  try {
    const { title, content, organizationId, departmentId, staffId } = req.body;

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

    // 2️⃣ Save editor content
    await FileContent.create({
      fileId: file.id,
      content,
    });

    res.status(201).json({
      success: true,
      message: "File created successfully",
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

module.exports = {
  createFile,
};
