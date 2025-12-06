const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlist");
const { authenticateToken } = require("../middlewares/auth/auth");

router
  .route("/")
  .get(authenticateToken, getWishlist)
  .post(authenticateToken, addToWishlist)
  .delete(authenticateToken, clearWishlist);

router.route("/:productId").delete(authenticateToken, removeFromWishlist);

module.exports = router;
