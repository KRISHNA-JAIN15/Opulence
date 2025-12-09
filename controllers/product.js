const Product = require("../models/product");
const Review = require("../models/review");
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
      console.log(`Filtering by category: "${category}"`);
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
      console.log("Category filter:", filter.category);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      // Use regex for partial matching (case-insensitive)
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    // Execute query
    console.log("Final filter object:", filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select("-__v")
      .lean();

    // Get ratings for all products
    const productIds = products.map((p) => p._id);
    const ratingsAggregation = await Review.aggregate([
      {
        $match: {
          product: { $in: productIds },
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Create a map for quick lookup
    const ratingsMap = {};
    ratingsAggregation.forEach((r) => {
      ratingsMap[r._id.toString()] = {
        rating: Math.round(r.avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: r.reviewCount,
      };
    });

    // Add ratings to products
    const productsWithRatings = products.map((product) => {
      const ratingData = ratingsMap[product._id.toString()];
      return {
        ...product,
        rating: ratingData?.rating || 0,
        reviewCount: ratingData?.reviewCount || 0,
      };
    });

    const total = await Product.countDocuments(filter);
    console.log(`Found ${products.length} products, total: ${total}`);

    res.status(200).json({
      success: true,
      data: productsWithRatings,
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
    const {
      name,
      description,
      price,
      costPrice,
      returnDays,
      inStock,
      category,
      brand,
      sku,
      weight,
      dimensions,
      material,
      color,
      warranty,
      origin,
      tags,
      keyFeatures,
      isActive,
      featured,
      discount,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    // Upload all images to Cloudinary
    const imageUploads = [];
    for (const file of req.files) {
      const cloudinaryResult = await uploadToCloudinary(
        file.buffer,
        "opulence/products"
      );
      imageUploads.push({
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
      });
    }

    // First image becomes the main image
    const mainImage = imageUploads[0];

    // Create product
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      costPrice: Number(costPrice) || 0,
      returnDays: Number(returnDays) || 0,
      inStock: Number(inStock) || 0,
      category,
      brand,
      sku,
      weight,
      dimensions,
      material,
      color,
      warranty,
      origin,
      tags,
      keyFeatures,
      isActive:
        isActive === "true" || isActive === true || isActive === undefined,
      featured: featured === "true" || featured === true,
      discount: Number(discount) || 0,
      image: mainImage.url,
      cloudinaryPublicId: mainImage.publicId,
      images: imageUploads,
      createdBy: req.user._id,
    });

    // Record inventory transaction if stock is added
    if (Number(inStock) > 0 && Number(costPrice) > 0) {
      const { recordInventoryAdd } = require("./transaction");
      try {
        await recordInventoryAdd(product, Number(inStock), Number(costPrice));
      } catch (txnError) {
        console.error("Failed to record inventory transaction:", txnError);
      }
    }

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
      costPrice,
      returnDays,
      inStock,
      category,
      brand,
      sku,
      weight,
      dimensions,
      material,
      color,
      warranty,
      origin,
      tags,
      keyFeatures,
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
    if (price !== undefined) product.price = Number(price);
    if (costPrice !== undefined) product.costPrice = Number(costPrice);
    if (returnDays !== undefined) product.returnDays = Number(returnDays);
    if (inStock !== undefined) product.inStock = Number(inStock);
    if (category) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (sku !== undefined) product.sku = sku;
    if (weight !== undefined) product.weight = weight;
    if (dimensions !== undefined) product.dimensions = dimensions;
    if (material !== undefined) product.material = material;
    if (color !== undefined) product.color = color;
    if (warranty !== undefined) product.warranty = warranty;
    if (origin !== undefined) product.origin = origin;
    if (tags !== undefined) product.tags = tags;
    if (keyFeatures !== undefined) product.keyFeatures = keyFeatures;
    if (isActive !== undefined)
      product.isActive = isActive === "true" || isActive === true;
    if (featured !== undefined)
      product.featured = featured === "true" || featured === true;
    if (discount !== undefined) product.discount = Number(discount);

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          await deleteFromCloudinary(img.publicId);
        }
      }
      if (product.cloudinaryPublicId) {
        await deleteFromCloudinary(product.cloudinaryPublicId);
      }

      // Upload new images
      const imageUploads = [];
      for (const file of req.files) {
        const cloudinaryResult = await uploadToCloudinary(
          file.buffer,
          "opulence/products"
        );
        imageUploads.push({
          url: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
        });
      }

      // Update main image and images array
      const mainImage = imageUploads[0];
      product.image = mainImage.url;
      product.cloudinaryPublicId = mainImage.publicId;
      product.images = imageUploads;
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

    const previousStock = product.inStock;
    let quantityAdded = 0;

    // Update quantity based on operation
    switch (operation) {
      case "add":
        product.inStock += Number(quantity);
        quantityAdded = Number(quantity);
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
        quantityAdded = Number(quantity) - previousStock;
        product.inStock = Number(quantity);
        break;
    }

    product.updatedBy = req.user._id;
    await product.save();

    // Record inventory transaction if stock was added
    if (quantityAdded > 0 && product.costPrice > 0) {
      const { recordInventoryAdd } = require("./transaction");
      try {
        await recordInventoryAdd(product, quantityAdded, product.costPrice);
      } catch (txnError) {
        console.error("Failed to record inventory transaction:", txnError);
      }
    }

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

// @desc    Get products by IDs (batch)
// @route   POST /api/products/batch
// @access  Public
const getProductsByIds = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product IDs array is required",
      });
    }

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).select("-__v");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products by IDs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// @desc    Quick search products (for live search dropdown)
// @route   GET /api/products/search/quick
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 1) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    // Use regex for partial matching (case-insensitive)
    const searchRegex = new RegExp(q.trim(), "i");

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
      ],
    })
      .limit(Number(limit))
      .select("name price image discount inStock category");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Quick search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
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
  getProductsByIds,
  searchProducts,
};
