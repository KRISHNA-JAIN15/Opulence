const express = require("express");
const {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");
const { authenticateToken, adminOnly } = require("../middlewares/auth/auth");

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Email verification routes
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      type: req.user.type,
      isVerified: req.user.isVerified,
      balance: req.user.balance || 0,
      createdAt: req.user.createdAt,
    },
  });
});

// Get user balance
router.get("/balance", authenticateToken, (req, res) => {
  res.json({
    success: true,
    balance: req.user.balance || 0,
  });
});

// Admin only routes
router.get("/all", authenticateToken, adminOnly, async (req, res) => {
  try {
    const User = require("../models/user");
    const users = await User.find().select(
      "-password -verificationToken -passwordResetToken"
    );
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get user activity (admin only)
router.get(
  "/:userId/activity",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const User = require("../models/user");
      const Order = require("../models/order");

      const { userId } = req.params;

      // Get user with wishlist populated
      const user = await User.findById(userId)
        .select("-password -verificationToken -passwordResetToken")
        .populate("wishlist", "name price image images category");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get user's orders
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("items.product", "name category");

      // Calculate stats
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => {
        if (order.orderStatus !== "cancelled") {
          return sum + (order.pricing?.total || 0);
        }
        return sum;
      }, 0);
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const wishlistCount = user.wishlist?.length || 0;

      // Calculate preferred categories from order history
      const categoryCount = {};
      orders.forEach((order) => {
        order.items.forEach((item) => {
          const category = item.product?.category || "Unknown";
          categoryCount[category] =
            (categoryCount[category] || 0) + item.quantity;
        });
      });

      const preferredCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent orders (last 10)
      const recentOrders = orders.slice(0, 10).map((order) => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        items: order.items,
        pricing: order.pricing,
        orderStatus: order.orderStatus,
      }));

      res.json({
        success: true,
        activity: {
          stats: {
            totalOrders,
            totalSpent,
            avgOrderValue,
            wishlistCount,
          },
          preferredCategories,
          wishlist: user.wishlist || [],
          recentOrders,
        },
      });
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Send promotional coupon email to all users (admin only)
router.post("/send-coupon", authenticateToken, adminOnly, async (req, res) => {
  try {
    const User = require("../models/user");
    const {
      sendCouponPromoEmail,
    } = require("../middlewares/email/emailService");

    const { couponCode, discountAmount } = req.body;

    if (!couponCode || !discountAmount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and discount amount are required",
      });
    }

    // Get all verified users (excluding admins)
    const users = await User.find({
      isVerified: true,
      type: { $ne: "admin" },
    }).select("email name");

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No verified users found to send emails to",
      });
    }

    // Send emails to all users
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (const user of users) {
      try {
        const result = await sendCouponPromoEmail(
          user.email,
          user.name,
          couponCode,
          discountAmount
        );
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          errors.push({ email: user.email, error: result.error });
        }
      } catch (err) {
        failCount++;
        errors.push({ email: user.email, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Promotional emails sent successfully`,
      stats: {
        total: users.length,
        success: successCount,
        failed: failCount,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error sending coupon emails:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
