const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullName email")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Allow only Admin or Order Owner
if (
  req.user.role !== "admin" &&
  order.user._id.toString() !== req.user._id.toString()
) {
  return res.status(403).json({
    success: false,
    message: "Access denied",
  });
}

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument({
      margin: 50,
    });

    doc.pipe(res);

    // Title
    doc
      .fontSize(24)
      .fillColor("#0d6efd")
      .text("ShopSphere", {
        align: "center",
      });

    doc
      .fontSize(18)
      .fillColor("black")
      .text("Invoice", {
        align: "center",
      });

    doc.moveDown();

    // Order Info
    doc.fontSize(12);
    doc.text(`Order ID : ${order._id}`);
    doc.text(`Customer : ${order.user.fullName}`);
    doc.text(`Email : ${order.user.email}`);
    doc.text(`Payment : ${order.paymentMethod}`);
    doc.text(`Status : ${order.orderStatus}`);
    doc.text(
      `Date : ${new Date(order.createdAt).toLocaleDateString()}`
    );

    doc.moveDown();

    // Shipping Address
    doc.fontSize(14).text("Shipping Address");
    doc.fontSize(12);

    if (order.shippingAddress) {
      doc.text(order.shippingAddress.fullName || "");
      doc.text(order.shippingAddress.phone || "");
      doc.text(order.shippingAddress.house || "");
      doc.text(order.shippingAddress.area || "");
      doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`
      );
      doc.text(order.shippingAddress.pincode || "");
    }

    doc.moveDown();

    // Products
    doc.fontSize(14).text("Products");
    doc.moveDown(0.5);

    order.orderItems.forEach((item) => {
      doc.text(
        `${item.name}   | Qty: ${item.quantity} | ₹${item.price}`
      );
    });

    doc.moveDown();

    doc
      .fontSize(16)
      .fillColor("green")
      .text(
        `Grand Total : ₹${order.totalPrice}`,
        {
          align: "right",
        }
      );

    doc.moveDown(2);

    doc
      .fontSize(12)
      .fillColor("gray")
      .text(
        "Thank you for shopping with ShopSphere!",
        {
          align: "center",
        }
      );

    doc.end();

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  downloadInvoice,
};