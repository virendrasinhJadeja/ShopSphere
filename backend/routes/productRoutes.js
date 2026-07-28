const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

console.log("✅ Product Routes Loaded");

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Review Route
router.post("/:id/reviews", protect, addProductReview);

// Admin Routes
router.post("/", protect, admin, upload.array("images", 5), addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;