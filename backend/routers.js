const express = require("express");
const router = express.Router();

const VideoController = require("./components/video/controller");
const GifsController = require("./components/gifs/controller");
router.use("/video", VideoController);
router.use("/gifs", GifsController);

module.exports = router;
