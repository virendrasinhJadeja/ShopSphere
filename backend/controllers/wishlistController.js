const User = require("../models/User");
const Product = require("../models/Product");

// ======================================
// Add Product to Wishlist
// ======================================
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Get logged-in user
    const user = await User.findById(req.user._id);

    // Check already exists
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist.",
      });
    }

    // Add product
    user.wishlist.push(productId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Wishlist
// ======================================
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist");

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Remove Product from Wishlist
// ======================================
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};