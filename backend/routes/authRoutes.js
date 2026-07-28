const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  adminDashboard,
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/profile", protect, getUserProfile);

router.get("/users", protect, admin, getAllUsers);

// Admin Route
router.get("/admin-dashboard", protect, admin, adminDashboard);

module.exports = router;