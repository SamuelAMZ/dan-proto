// this will upload files
// this file will activate a context by contextId

const express = require("express");
const uploadFileRoute = express.Router();
const Multer = require("multer");

// general helpers
const uploadFileToBucket = require("../../utils/uploadFileToBucket");

// multer
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // no larger than 100mb
  },
});

uploadFileRoute.post("/", multer.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded.", code: "bad" });
    return;
  }

  //   upload file to a bucket
  uploadFileToBucket(req.file, res);
});

module.exports = uploadFileRoute;
