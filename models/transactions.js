const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sale", "inventory_add", "refund", "expense", "coupon_discount"],
      required: true,
    },
    // Reference to related entities
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Financial details
    amount: {
      type: Number,
      required: true,
    },
    costAmount: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    margin: {
      type: Number,
      default: 0,
    },
    // Transaction details
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    // For sales
    sellingPrice: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    // Flow type
    flowType: {
      type: String,
      enum: ["inflow", "outflow"],
      required: true,
    },
    // Status
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
transactionSchema.index({ type: 1, createdAt: -1 });
transactionSchema.index({ flowType: 1, createdAt: -1 });
transactionSchema.index({ order: 1 });
transactionSchema.index({ product: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
