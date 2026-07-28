const Category = require("../models/Category");

// ======================================
// Add Category (Admin)
// ======================================
const addCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    // Check required field
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    // Create category
    const category = await Category.create({
      name,
      image,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category added successfully.",
      category,
    });
  } catch (error) {
    console.error("Add Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get All Categories
// ======================================
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Category By ID
// ======================================
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Update Category
// ===============================
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Delete Category
// ===============================
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};