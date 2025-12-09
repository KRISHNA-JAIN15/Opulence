const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCoupon,
  validateCoupon,
  applyCoupon,
  sendCouponToUsers,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
} = require("../controllers/coupon");
const { authenticateToken, adminOnly } = require("../middlewares/auth/auth");

// Public routes (for logged in users)
router.post("/validate", authenticateToken, validateCoupon);
router.post("/apply", authenticateToken, applyCoupon);

// Admin routes
router.post("/", authenticateToken, adminOnly, createCoupon);
router.get("/", authenticateToken, adminOnly, getAllCoupons);
router.get("/stats", authenticateToken, adminOnly, getCouponStats);
router.get("/:id", authenticateToken, adminOnly, getCoupon);
router.put("/:id", authenticateToken, adminOnly, updateCoupon);
router.delete("/:id", authenticateToken, adminOnly, deleteCoupon);
router.post("/:couponId/send", authenticateToken, adminOnly, sendCouponToUsers);

module.exports = router;
