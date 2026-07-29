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

// ================= SHIPPING =================

doc
  .roundedRect(50, 260, 500, 120, 5)
  .stroke("#d1d5db");

doc
  .fontSize(14)
  .font("Helvetica-Bold")
  .text("SHIPPING ADDRESS", 60, 275);

doc
  .fontSize(11)
  .font("Helvetica")
  .text(order.shippingAddress?.fullName || "", 60, 300)
  .text(order.shippingAddress?.phone || "", 60, 318)
  .text(order.shippingAddress?.house || "", 60, 336)
  .text(order.shippingAddress?.area || "", 60, 354)
  .text(
    `${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}`,
    60,
    372
  )
  .text(order.shippingAddress?.pincode || "", 60, 390);

 // ================= PRODUCTS TABLE =================

let tableTop = 430;

// Header Background
doc
  .rect(50, tableTop, 500, 25)
  .fill("#2563eb");

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(11);

doc.text("Product", 60, tableTop + 7);
doc.text("Qty", 320, tableTop + 7);
doc.text("Price", 390, tableTop + 7);
doc.text("Total", 480, tableTop + 7);

doc.fillColor("black");

let y = tableTop + 30;

order.orderItems.forEach((item) => {

  const total = item.price * item.quantity;

  doc
    .font("Helvetica")
    .fontSize(11);

  doc.text(item.product?.name || item.name, 60, y);

  doc.text(String(item.quantity), 325, y);

  doc.text(
    `₹${item.price.toLocaleString("en-IN")}`,
    390,
    y
  );

  doc.text(
    `₹${total.toLocaleString("en-IN")}`,
    470,
    y
  );

  // Row Line
  doc
    .moveTo(50, y + 18)
    .lineTo(550, y + 18)
    .stroke("#dddddd");

  y += 28;

});

// ================= SUMMARY =================

const shipping = 0;
const gst = 0;
const discount = 0;
const subtotal = order.totalPrice - shipping + discount;

let summaryY = y + 30;

// Summary Box
doc
  .roundedRect(330, summaryY, 220, 120, 5)
  .stroke("#d1d5db");

doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("black");

doc.text("Subtotal", 345, summaryY + 15);
doc.text(
  `₹${subtotal.toLocaleString("en-IN")}`,
  470,
  summaryY + 15,
  { width: 60, align: "right" }
);

doc.text("Shipping", 345, summaryY + 38);
doc.text("FREE", 470, summaryY + 38, {
  width: 60,
  align: "right",
});

doc.text("GST", 345, summaryY + 61);
doc.text(`₹${gst}`, 470, summaryY + 61, {
  width: 60,
  align: "right",
});

doc.text("Discount", 345, summaryY + 84);
doc.text(`₹${discount}`, 470, summaryY + 84, {
  width: 60,
  align: "right",
});

// ================= GRAND TOTAL =================

summaryY += 140;

doc
  .roundedRect(330, summaryY, 220, 42, 5)
  .fill("#2563eb");

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(15);

doc.text("Grand Total", 345, summaryY + 14);

doc.text(
  `₹${order.totalPrice.toLocaleString("en-IN")}`,
  430,
  summaryY + 14,
  {
    width: 100,
    align: "right",
  }
);

// ================= FOOTER =================

summaryY += 70;

doc
  .fillColor("#666666")
  .font("Helvetica")
  .fontSize(10);

doc.text(
  "Thank you for shopping with ShopSphere!",
  50,
  summaryY,
  {
    align: "center",
    width: 500,
  }
);

doc.moveDown(0.5);

doc.text(
  "This is a computer generated invoice. No signature required.",
  {
    align: "center",
  }
);

doc.moveDown(0.5);

doc.text(
  "support@shopsphere.com | https://shopsphere-vlon.vercel.app",
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