const express = require("express");
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} = require("../controllers/review");
const { authenticateToken } = require("../middlewares/auth/auth");

const router = express.Router();

// Public routes
router.get("/product/:productId", getProductReviews);

// Protected routes
router.post("/", authenticateToken, createReview);
router.put("/:id", authenticateToken, updateReview);
router.delete("/:id", authenticateToken, deleteReview);
router.patch("/:id/helpful", authenticateToken, markHelpful);

module.exports = router;
