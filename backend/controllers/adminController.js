const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    const totalSales = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const latestOrders = await Order.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

     const topProducts = await Product.find()
      .sort({ numReviews: -1 })
      .limit(5)
      .select("name price ratings numReviews");
      
      const monthlySales = await Order.aggregate([
  {
    $match: {
      orderStatus: {
        $ne: "Cancelled",
      },
    },
  },
  {
    $group: {
      _id: {
        $month: "$createdAt",
      },
      totalSales: {
        $sum: "$totalPrice",
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
]);

    res.status(200).json({
      success: true,

      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      latestOrders,
      topProducts,
      monthlySales,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboardStats,
};