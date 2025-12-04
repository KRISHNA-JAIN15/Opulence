const Product = require("../models/product");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} = require("../utils/cloudinary");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select("-__v");

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("-__v");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, inStock, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image",
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      "opulence/products"
    );

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      inStock: inStock || 0,
      category,
      image: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      inStock,
      category,
      isActive,
      featured,
      discount,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (inStock !== undefined) product.inStock = inStock;
    if (category) product.category = category;
    if (isActive !== undefined) product.isActive = isActive;
    if (featured !== undefined) product.featured = featured;
    if (discount !== undefined) product.discount = discount;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (product.cloudinaryPublicId) {
        await deleteFromCloudinary(product.cloudinaryPublicId);
      }

      // Upload new image
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        "opulence/products"
      );

      product.image = cloudinaryResult.secure_url;
      product.cloudinaryPublicId = cloudinaryResult.public_id;
    }

    product.updatedBy = req.user._id;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary
    if (product.cloudinaryPublicId) {
      await deleteFromCloudinary(product.cloudinaryPublicId);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// @desc    Update product quantity
// @route   PATCH /api/products/:id/quantity
// @access  Private/Admin
const updateProductQuantity = async (req, res) => {
  try {
    const { quantity, operation = "set" } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: "Please provide quantity",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update quantity based on operation
    switch (operation) {
      case "add":
        product.inStock += Number(quantity);
        break;
      case "subtract":
        product.inStock -= Number(quantity);
        if (product.inStock < 0) {
          return res.status(400).json({
            success: false,
            message: "Insufficient stock",
          });
        }
        break;
      case "set":
      default:
        product.inStock = Number(quantity);
        break;
    }

    product.updatedBy = req.user._id;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product quantity updated successfully",
      data: {
        id: product._id,
        name: product.name,
        inStock: product.inStock,
      },
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product quantity",
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories/all
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      featured: true,
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("-__v");

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
    });
  }
};

// @desc    Get products with highest discounts
// @route   GET /api/products/discounted
// @access  Public
const getDiscountedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      discount: { $gt: 0 },
    })
      .sort({ discount: -1, createdAt: -1 })
      .limit(Number(limit))
      .select("-__v");

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get discounted products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch discounted products",
    });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    // First get the current product to find its category
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find related products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: currentProduct.category,
      isActive: true,
    })
      .limit(Number(limit))
      .select("-__v");

    res.status(200).json({
      success: true,
      data: relatedProducts,
    });
  } catch (error) {
    console.error("Get related products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related products",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductQuantity,
  getCategories,
  getFeaturedProducts,
  getDiscountedProducts,
  getRelatedProducts,
};
