const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// Add Product to Cart
router.post("/:productId", protect, addToCart);

// Get User Cart
router.get("/", protect, getCart);

router.put("/:productId", protect, updateCartQuantity);

router.delete("/:productId", protect, removeFromCart);

router.delete("/", protect, clearCart);

module.exports = router;