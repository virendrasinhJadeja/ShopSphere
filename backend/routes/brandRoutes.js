const express = require("express");
const router = express.Router();

const {
  addBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllBrands);
router.get("/:id", getBrandById);

// Admin Route
router.post("/", protect, admin, addBrand);
router.put("/:id", protect, admin, updateBrand);
router.delete("/:id", protect, admin, deleteBrand);

module.exports = router;