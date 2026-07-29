const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const downloadInvoice = async (req, res) => {
  console.log("NEW INVOICE CONTROLLER RUNNING");
  
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


// ================= HEADER =================

doc
  .rect(0, 0, doc.page.width, 90)
  .fill("#0d6efd");

doc
  .fillColor("white")
  .fontSize(28)
  .font("Helvetica-Bold")
  .text("ShopSphere", 50, 25);

doc
  .fontSize(16)
  .text("INVOICE", 420, 28);

doc
  .fontSize(10)
  .text(`Invoice #: INV-${order._id.toString().slice(-6)}`, 420, 48);

doc
  .text(
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    420,
    62
  );

doc.moveDown(5);

doc.fillColor("black");

   // ================= CUSTOMER DETAILS =================

const startY = 120;

doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .text("BILL TO", 50, startY);

doc
  .font("Helvetica")
  .fontSize(11)
  .text(order.user.fullName, 50, startY + 20)
  .text(order.user.email, 50, startY + 38);

doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .text("SHIPPING ADDRESS", 320, startY);

if (order.shippingAddress) {
  doc
    .font("Helvetica")
    .fontSize(11)
    .text(order.shippingAddress.fullName || "", 320, startY + 20)
    .text(order.shippingAddress.phone || "")
    .text(order.shippingAddress.house || "")
    .text(order.shippingAddress.area || "")
    .text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state}`
    )
    .text(order.shippingAddress.pincode || "");
}

// Divider Line
doc
  .moveTo(50, 250)
  .lineTo(545, 250)
  .strokeColor("#cccccc")
  .stroke();

    // ================= PRODUCTS TABLE =================

let tableTop = 270;

// Header Background
doc
  .rect(50, tableTop, 495, 25)
  .fill("#0d6efd");

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(11);

doc.text("Product", 60, tableTop + 8);
doc.text("Qty", 310, tableTop + 8);
doc.text("Price", 380, tableTop + 8);
doc.text("Total", 470, tableTop + 8);

tableTop += 35;

doc.fillColor("black");

order.orderItems.forEach((item) => {

  const total = item.price * item.quantity;

  doc
    .font("Helvetica")
    .fontSize(10);

  doc.text(item.product?.name || item.name, 60, tableTop, {
    width: 220,
  });

  doc.text(item.quantity.toString(), 320, tableTop);

  doc.text(`₹${item.price}`, 380, tableTop);

  doc.text(`₹${total}`, 470, tableTop);

  // Row Line
  doc
    .moveTo(50, tableTop + 18)
    .lineTo(545, tableTop + 18)
    .strokeColor("#dddddd")
    .stroke();

  tableTop += 28;

});

   // ================= SUMMARY =================

tableTop += 20;

const shipping = 0;
const gst = 0;
const subtotal = order.totalPrice - shipping;

doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("black");

doc.text("Subtotal", 360, tableTop);
doc.text(`₹${subtotal}`, 470, tableTop, {
  width: 70,
  align: "right",
});

tableTop += 20;

doc.text("Shipping", 360, tableTop);
doc.text("FREE", 470, tableTop, {
  width: 70,
  align: "right",
});

tableTop += 20;

doc.text("GST", 360, tableTop);
doc.text(`₹${gst}`, 470, tableTop, {
  width: 70,
  align: "right",
});

// Grand Total Box
tableTop += 35;

doc
  .roundedRect(340, tableTop, 205, 35, 5)
  .fill("#0d6efd");

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(14);

doc.text("Grand Total", 350, tableTop + 10);

doc.text(`₹${order.totalPrice}`, 455, tableTop + 10, {
  width: 80,
  align: "right",
});

// ================= FOOTER =================

tableTop += 80;

doc
  .fillColor("#666666")
  .font("Helvetica")
  .fontSize(11)
  .text(
    "Thank you for shopping with ShopSphere!",
    50,
    tableTop,
    {
      align: "center",
      width: 500,
    }
  );

doc.moveDown(0.5);

doc.text(
  "For support: support@shopsphere.com",
  {
    align: "center",
  }
);

doc.text(
  "https://shopsphere-live.vercel.app/",
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