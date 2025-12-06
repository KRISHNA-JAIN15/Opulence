const User = require("../models/user");
const Product = require("../models/product");

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      select: "name price image images category discount inStock",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    // Add product to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Populate wishlist before sending response
    await user.populate({
      path: "wishlist",
      select: "name price images category discount inStock",
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({
        message: "Product not in wishlist",
      });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({
      message: "Error removing from wishlist",
      error: error.message,
    });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    res.status(500).json({
      message: "Error clearing wishlist",
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
