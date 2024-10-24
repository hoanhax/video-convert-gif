const express = require("express");
const router = express.Router({ mergeParams: true });
const fs = require("fs");
const path = require("path");

// Get all gifs files
router.get("/", (req, res) => {
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
