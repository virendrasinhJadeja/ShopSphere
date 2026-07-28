const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  getDashboardStats,
} = require("../controllers/adminController");

// Dashboard Statistics
router.get(
  "/dashboard",
  protect,
  admin,
  getDashboardStats
);

module.exports = router;