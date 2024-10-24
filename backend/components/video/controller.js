const path = require("path");
const fs = require("fs");

const multer = require("multer");
const express = require("express");
const router = express.Router({ mergeParams: true });

const videoQueue = require("./queue");

const CONVERT_RETRY_ATTEMPTS = 3;
const CONVERT_TIMEOUT = 300000; // 5 minutes
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../media/videos")); // Set the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the file name
  },
});

const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

/**
 * Upload a video file then add it to the queue to convert
 */
router.post("/", upload.single("video"), (req, res) => {
  const filePath = req.file.path;
  videoQueue.add(
    { filePath },
    {
      attempts: CONVERT_RETRY_ATTEMPTS,
      timeout: CONVERT_TIMEOUT, // 5 minutes
      removeOnComplete: false,
    }
  );
  res.json({ message: "File uploaded successfully" });
});

// Get all gifs files
router.get("/gifs", (req, res) => {
  const gifs = fs.readdirSync(path.join(__dirname, "../../media/gifs"));
  res.json(gifs);
});

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../media/gifs", filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

module.exports = router;
