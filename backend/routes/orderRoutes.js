const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const {
  downloadInvoice,
} = require("../controllers/invoiceController");

const { protect, admin } = require("../middleware/authMiddleware");

// Place Order
router.post("/", protect, placeOrder);

// Get My Orders
router.get("/my-orders", protect, getMyOrders);

router.get("/", protect, admin, getAllOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, admin, updateOrderStatus);

router.put("/:id/cancel", protect, cancelOrder);

router.get("/:id/invoice", protect, downloadInvoice);

module.exports = router;