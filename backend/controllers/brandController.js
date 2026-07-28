const Brand = require("../models/Brand");

// ======================================
// Add Brand (Admin)
// ======================================
const addBrand = async (req, res) => {
  try {
    const { name, logo, description } = req.body;

    // Validate required field
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required.",
      });
    }

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists.",
      });
    }

    // Create brand
    const brand = await Brand.create({
      name,
      logo,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Brand added successfully.",
      brand,
    });
  } catch (error) {
    console.error("Add Brand Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get All Brands
// ======================================
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: brands.length,
      brands,
    });
  } catch (error) {
    console.error("Get Brands Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Brand By ID
// ======================================
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    res.status(200).json({
      success: true,
      brand,
    });
  } catch (error) {
    console.error("Get Brand By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Update Brand
// ===============================
const updateBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    brand.name = name || brand.name;
    brand.description = description || brand.description;

    await brand.save();

    res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      brand,
    });
  } catch (error) {
    console.error("Update Brand Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Delete Brand
// ===============================
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    await brand.deleteOne();

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Brand Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};