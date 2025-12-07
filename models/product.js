const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    costPrice: {
      type: Number,
      default: 0,
      min: [0, "Cost price cannot be negative"],
    },
    returnDays: {
      type: Number,
      default: 0,
      min: [0, "Return days cannot be negative"],
      max: [365, "Return days cannot exceed 365"],
    },
    inStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    cloudinaryPublicId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // Additional product specifications
    brand: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },
    weight: {
      type: String,
      trim: true,
    },
    dimensions: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    warranty: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    tags: {
      type: String,
      trim: true,
    },
    keyFeatures: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for faster queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
