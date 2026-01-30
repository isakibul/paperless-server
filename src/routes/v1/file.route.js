const router = require("express").Router();
const { createFile } = require("../../api/v1/file");

router.post("/create", createFile);

module.exports = router;
