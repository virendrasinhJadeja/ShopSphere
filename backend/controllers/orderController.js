const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ======================================
// Place Order
// ======================================
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get User Cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    // Prepare Order Items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity,
    }));

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalPrice: cart.totalPrice,
    });

    // Reduce Stock
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // Clear Cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Place Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get My Orders
// ======================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Order By ID
// ======================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullName email")
      .populate({
        path: "orderItems.product",
        select: "name images price category brand stock",
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get All Orders (Admin)
// ======================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
  .populate("user", "fullName email")
  .populate("orderItems.product", "name");
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Update Order Status (Admin)
// ======================================
const updateOrderStatus = async (req, res) => {
  console.log("BODY =>", req.body);

  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Fetch updated document from MongoDB
    const updatedOrder = await Order.findById(order._id);

    console.log("Saved Status:", updatedOrder.orderStatus);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Cancel Order
// ======================================
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Only Pending or Confirmed orders can be cancelled
    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled.",
      });
    }

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};