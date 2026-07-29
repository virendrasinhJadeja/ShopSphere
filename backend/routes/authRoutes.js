const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  adminDashboard,
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/profile", protect, getUserProfile);

router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);


// Admin Route
router.get("/admin-dashboard", protect, admin, adminDashboard);

module.exports = router;