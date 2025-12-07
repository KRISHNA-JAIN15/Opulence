const express = require("express");
const router = express.Router();
const { authenticateToken, adminOnly } = require("../middlewares/auth/auth");
const {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  createWalletOrder,
  getUserOrders,
  getOrderById,
  getOrderByNumber,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  getSalesStats,
  initiateReturn,
  getReturnRequests,
  updateReturnStatus,
} = require("../controllers/order");

// Payment routes
router.get("/payment/key", authenticateToken, getRazorpayKey);
router.post("/payment/create", authenticateToken, createRazorpayOrder);
router.post("/payment/verify", authenticateToken, verifyPaymentAndCreateOrder);
router.post("/payment/wallet", authenticateToken, createWalletOrder);

// User order routes
router.get("/my-orders", authenticateToken, getUserOrders);
router.get("/:orderId", authenticateToken, getOrderById);
router.get("/number/:orderNumber", authenticateToken, getOrderByNumber);
router.put("/:orderId/cancel", authenticateToken, cancelOrder);
router.post("/:orderId/return", authenticateToken, initiateReturn);

// Admin routes
router.get("/admin/all", authenticateToken, adminOnly, getAllOrders);
router.get("/admin/returns", authenticateToken, adminOnly, getReturnRequests);
router.put(
  "/admin/:orderId/status",
  authenticateToken,
  adminOnly,
  updateOrderStatus
);
router.put(
  "/admin/:orderId/return-status",
  authenticateToken,
  adminOnly,
  updateReturnStatus
);
router.get("/admin/stats", authenticateToken, adminOnly, getOrderStats);
router.get("/admin/sales-stats", authenticateToken, adminOnly, getSalesStats);

module.exports = router;
