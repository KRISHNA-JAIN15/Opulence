const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductQuantity,
  getCategories,
  getFeaturedProducts,
  getDiscountedProducts,
} = require("../controllers/product");
const { authenticateToken, adminOnly } = require("../middlewares/auth/auth");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/categories/all", getCategories);
router.get("/featured", getFeaturedProducts);
router.get("/discounted", getDiscountedProducts);
router.get("/:id", getProductById);

// Admin only routes - Create, Update, Delete
router.post(
  "/",
  authenticateToken,
  adminOnly,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete("/:id", authenticateToken, adminOnly, deleteProduct);

// Admin only - Update quantity
router.patch(
  "/:id/quantity",
  authenticateToken,
  adminOnly,
  updateProductQuantity
);

module.exports = router;
