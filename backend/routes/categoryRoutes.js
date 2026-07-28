const express = require("express");
const router = express.Router();

const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin Routes
router.post("/", protect, admin, addCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;