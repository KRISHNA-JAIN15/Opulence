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
      createdAt: req.user.createdAt,
    },
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

module.exports = router;
