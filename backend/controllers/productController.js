const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");



const uploadToCloudinary = (fileBuffer, folder = "shopsphere/products") => {
  return new Promise((resolve, reject) => {
    console.log("Cloudinary Config:", cloudinary.config());
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ======================================
// Add New Product (Admin)
// ======================================
const addProduct = async (req, res) => {
  try {
    const {
  name,
  description,
  category,
  brand,
  price,
  stock,
  images,
  discount,
} = req.body;

console.log("req.body =", req.body);
console.log("req.file =", req.file);

    // Check required fields
    if (
      !name ||
      !description ||
      !brand ||
      !category ||
      !price ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check Category
const categoryExists = await Category.findById(category);

if (!categoryExists) {
  return res.status(404).json({
    success: false,
    message: "Category not found.",
  });
}

// Check Brand
const brandExists = await Brand.findById(brand);

if (!brandExists) {
  return res.status(404).json({
    success: false,
    message: "Brand not found.",
  });
}

let imageUrls = [];

if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const result = await uploadToCloudinary(file.buffer);
    imageUrls.push(result.secure_url);
  }
}

    // Create Product
    const product = await Product.create({
  name,
  description,
  category,
  brand,
  price,
  stock,
  images: imageUrls.length ? imageUrls : images,
  discount,
});

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get All Products
// ======================================
const getAllProducts = async (req, res) => {
  try {
    // Query Parameters
const keyword = req.query.keyword || "";
const category = req.query.category || "";
const brand = req.query.brand || "";
const sort = req.query.sort || "newest";

const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;

const skip = (page - 1) * limit;


let sortOption = {};

switch (sort) {
  case "price_asc":
    sortOption = { price: 1 };
    break;

  case "price_desc":
    sortOption = { price: -1 };
    break;

  case "oldest":
    sortOption = { createdAt: 1 };
    break;

  case "discount":
    sortOption = { discount: -1 };
    break;

  default:
    sortOption = { createdAt: -1 };
}

// Search Filter
const filter = {};

if (keyword) {
  filter.name = {
    $regex: keyword,
    $options: "i",
  };
}

if (category) {
  filter.category = category;
}

if (brand) {
  filter.brand = brand;
}

const products = await Product.find(filter)
  .populate("category", "name")
  .populate("brand", "name")
  .sort(sortOption)
  .skip(skip)
  .limit(limit);


  const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
  success: true,
  count: products.length,
  totalProducts,
  currentPage: page,
  totalPages: Math.ceil(totalProducts / limit),
  products,
});
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Single Product By ID
// ======================================
const getProductById = async (req, res) => {
  try {
    // Get Product
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("brand", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Related Products
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .limit(4)
      .populate("category", "name")
      .populate("brand", "name");

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Update Product (Admin)
// ======================================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Delete Product (Admin)
// ======================================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Add Product Review
// ======================================
const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product.",
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.fullName,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.ratings =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
};