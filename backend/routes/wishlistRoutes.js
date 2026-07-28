const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

// Add Product to Wishlist
router.post("/:productId", protect, addToWishlist);

// Get Wishlist
router.get("/", protect, getWishlist);

// Remove Product
router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;