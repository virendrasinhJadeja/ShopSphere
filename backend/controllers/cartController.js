const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ======================================
// Add Product to Cart
// ======================================
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Check Product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    // Create cart if not exists
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    // Calculate Total
    let total = 0;

    for (const item of cart.items) {
      const p = await Product.findById(item.product);
      total += p.price * item.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart.",
      cart,
    });
  } catch (error) {
    console.error("Add Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Cart
// ======================================
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Update Cart Quantity
// ======================================
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    item.quantity = quantity;

    // Recalculate total
    let total = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);
      total += product.price * cartItem.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Remove Product From Cart
// ======================================
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate total price
    let total = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      total += product.price * item.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart.",
      cart,
    });
  } catch (error) {
    console.error("Remove Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Clear Cart
// ======================================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
      cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};