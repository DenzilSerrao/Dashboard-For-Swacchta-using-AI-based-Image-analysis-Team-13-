const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController"); // Importing user controller functions
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for authentication

// GET route to fetch the user profile
// Endpoint: /api/users/profile
router.get("/api/profile", authMiddleware, getUserProfile);

// PUT route to update the user profile
// Endpoint: /api/users/profile
router.put("/api/profile", authMiddleware, updateUserProfile);

module.exports = router;
