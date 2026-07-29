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



// ================= HEADER =================

doc.rect(0, 0, 700, 95).fill("#2563eb");

doc
  .fillColor("white")
  .fontSize(30)
  .font("Helvetica-Bold")
  .text("ShopSphere", 50, 30);

doc
  .fontSize(12)
  .font("Helvetica")
  .text("Smart Shopping • Trusted Delivery", 52, 65);

doc
  .fontSize(24)
  .font("Helvetica-Bold")
  .text("INVOICE", 420, 25);

doc
  .fontSize(11)
  .font("Helvetica")
  .text(`Invoice #: INV-${order._id.toString().slice(-6)}`, 420, 55);

doc.text(
  `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
  420,
  72
);

doc.moveDown(5);
doc.fillColor("black");

// ================= SELLER =================

doc
  .roundedRect(50, 120, 240, 120, 5)
  .stroke("#d1d5db");

doc
  .fontSize(14)
  .font("Helvetica-Bold")
  .text("SELLER", 60, 135);

doc
  .fontSize(11)
  .font("Helvetica")
  .text("ShopSphere Pvt. Ltd.", 60, 160)
  .text("Ahmedabad, Gujarat", 60, 178)
  .text("support@shopsphere.com", 60, 196)
  .text("+91 8460233348", 60, 214);

// ================= BILL TO =================

doc
  .roundedRect(310, 120, 240, 120, 5)
  .stroke("#d1d5db");

doc
  .fontSize(14)
  .font("Helvetica-Bold")
  .text("BILL TO", 320, 135);

doc
  .fontSize(11)
  .font("Helvetica")
  .text(order.user.fullName, 320, 160)
  .text(order.user.email, 320, 178);

if (order.shippingAddress?.phone) {
  doc.text(order.shippingAddress.phone, 320, 196);
}

// ================= SHIPPING ADDRESS =================

const address = order.shippingAddress || {};

doc
  .roundedRect(50, 260, 500, 110, 5)
  .stroke("#d1d5db");

doc
  .fontSize(14)
  .font("Helvetica-Bold")
  .fillColor("black")
  .text("SHIPPING ADDRESS", 60, 275);

let shippingY = 300;

doc.font("Helvetica").fontSize(11);

if (address.fullName) {
  doc.text(address.fullName, 60, shippingY);
  shippingY += 16;
}

if (address.phone) {
  doc.text(address.phone, 60, shippingY);
  shippingY += 16;
}

if (address.house) {
  doc.text(address.house, 60, shippingY);
  shippingY += 16;
}

if (address.area) {
  doc.text(address.area, 60, shippingY);
  shippingY += 16;
}

if (address.city || address.state) {
  doc.text(
    `${address.city || ""}, ${address.state || ""}`,
    60,
    shippingY
  );
  shippingY += 16;
}

if (address.pincode) {
  doc.text(address.pincode, 60, shippingY);
}

// ================= PRODUCTS =================

const tableTop = 400;
const rowHeight = 30;

// Table Title
doc
  .fontSize(14)
  .font("Helvetica-Bold")
  .fillColor("black")
  .text("PRODUCT DETAILS", 50, tableTop - 25);

// Header
doc
  .rect(50, tableTop, 500, rowHeight)
  .fill("#2563eb");

doc.fillColor("white").fontSize(11).font("Helvetica-Bold");

doc.text("Product", 60, tableTop + 9);
doc.text("Qty", 300, tableTop + 9);
doc.text("Price", 370, tableTop + 9);
doc.text("Total", 465, tableTop + 9);

let currentY = tableTop + rowHeight;

order.orderItems.forEach((item) => {

  const total = item.price * item.quantity;

  // Row Border
  doc
    .rect(50, currentY, 500, rowHeight)
    .stroke("#dcdcdc");

  doc
    .fillColor("black")
    .font("Helvetica")
    .fontSize(11);

  doc.text(
    item.product?.name || item.name,
    60,
    currentY + 9,
    {
      width: 220,
    }
  );

  doc.text(
    item.quantity.toString(),
    305,
    currentY + 9
  );

  doc.text(
    `₹${item.price.toLocaleString("en-IN")}`,
    365,
    currentY + 9
  );

  doc.text(
    `₹${total.toLocaleString("en-IN")}`,
    455,
    currentY + 9
  );

  currentY += rowHeight;

});

// ================= SUMMARY =================

const shipping = 0;
const gst = 0;
const discount = 0;
const subtotal = order.totalPrice;

const summaryX = 330;
const summaryWidth = 220;

let summaryY = currentY + 25;

// Box
doc
  .roundedRect(summaryX, summaryY, summaryWidth, 120, 5)
  .stroke("#cccccc");

doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("black");

// Subtotal
doc.text("Subtotal", summaryX + 15, summaryY + 15);

doc.text(
  `₹${subtotal.toLocaleString("en-IN")}`,
  summaryX + 110,
  summaryY + 15,
  {
    width: 90,
    align: "right",
  }
);

// Shipping
doc.text("Shipping", summaryX + 15, summaryY + 40);

doc.text(
  "FREE",
  summaryX + 110,
  summaryY + 40,
  {
    width: 90,
    align: "right",
  }
);

// GST
doc.text("GST", summaryX + 15, summaryY + 65);

doc.text(
  `₹${gst}`,
  summaryX + 110,
  summaryY + 65,
  {
    width: 90,
    align: "right",
  }
);

// Discount
doc.text("Discount", summaryX + 15, summaryY + 90);

doc.text(
  `₹${discount}`,
  summaryX + 110,
  summaryY + 90,
  {
    width: 90,
    align: "right",
  }
);

// Grand Total
summaryY += 140;

doc
  .rect(summaryX, summaryY, summaryWidth, 38)
  .fill("#2563eb");

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(14);

doc.text(
  "Grand Total",
  summaryX + 15,
  summaryY + 12
);

doc.text(
  `₹${order.totalPrice.toLocaleString("en-IN")}`,
  summaryX + 95,
  summaryY + 12,
  {
    width: 100,
    align: "right",
  }
);

// ================= FOOTER =================

const footerY = summaryY + 70;

doc
  .moveTo(50, footerY - 20)
  .lineTo(550, footerY - 20)
  .stroke("#cccccc");

doc
  .fillColor("#555555")
  .font("Helvetica")
  .fontSize(11);

doc.text(
  `Payment Method : ${order.paymentMethod}`,
  50,
  footerY
);

doc.text(
  `Order Status : ${order.orderStatus}`,
  50,
  footerY + 18
);

doc.text(
  "Thank you for shopping with ShopSphere!",
  50,
  footerY + 50,
  {
    align: "center",
    width: 500,
  }
);

doc.fontSize(9);

doc.text(
  "This is a computer generated invoice. No signature required.",
  50,
  footerY + 68,
  {
    align: "center",
    width: 500,
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