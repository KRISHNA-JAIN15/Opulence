const express = require("express");
const router = express.Router();
const { authenticateToken, adminOnly } = require("../middlewares/auth/auth");
const {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getUserOrders,
  getOrderById,
  getOrderByNumber,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/order");

// Payment routes
router.get("/payment/key", authenticateToken, getRazorpayKey);
router.post("/payment/create", authenticateToken, createRazorpayOrder);
router.post("/payment/verify", authenticateToken, verifyPaymentAndCreateOrder);

// User order routes
router.get("/my-orders", authenticateToken, getUserOrders);
router.get("/:orderId", authenticateToken, getOrderById);
router.get("/number/:orderNumber", authenticateToken, getOrderByNumber);
router.put("/:orderId/cancel", authenticateToken, cancelOrder);

// Admin routes
router.get("/admin/all", authenticateToken, adminOnly, getAllOrders);
router.put(
  "/admin/:orderId/status",
  authenticateToken,
  adminOnly,
  updateOrderStatus
);
router.get("/admin/stats", authenticateToken, adminOnly, getOrderStats);

module.exports = router;
