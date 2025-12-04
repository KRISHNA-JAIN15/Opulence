const Review = require("../models/review");
const Product = require("../models/product");
const mongoose = require("mongoose");

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    // Get reviews
    const reviews = await Review.find({
      product: productId,
      isActive: true,
    })
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select("-__v");

    const total = await Review.countDocuments({
      product: productId,
      isActive: true,
    });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    const stats =
      ratingStats.length > 0
        ? {
            averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
            totalReviews: ratingStats[0].totalReviews,
            ratingDistribution: ratingStats[0].ratingDistribution.reduce(
              (acc, rating) => {
                acc[rating] = (acc[rating] || 0) + 1;
                return acc;
              },
              {}
            ),
          }
        : {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: {},
          };

    res.status(200).json({
      success: true,
      data: reviews,
      stats,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;

    // Validate required fields
    if (!product || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = await Review.create({
      product,
      user: req.user._id,
      rating,
      title,
      comment,
    });

    // Populate user data
    await review.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    // Update review
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.type !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

// @desc    Mark review as helpful
// @route   PATCH /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.helpful += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review marked as helpful",
      data: {
        id: review._id,
        helpful: review.helpful,
      },
    });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark review as helpful",
    });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
};
