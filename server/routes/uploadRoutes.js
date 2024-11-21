const express = require("express");
const router = express.Router();
const { uploadImage, getUploads } = require("../controllers/uploadController");

// Routes
router.post("/", uploadImage);
router.get("/", getUploads);

module.exports = router;
