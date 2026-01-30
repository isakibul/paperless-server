const router = require("express").Router();
const { createFile, getAllFiles } = require("../../api/v1/file");

router.post("/create", createFile);
router.get("/all", getAllFiles);

module.exports = router;
