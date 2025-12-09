const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountAmount: {
      type: Number,
      required: [true, "Discount amount is required"],
      min: [0, "Discount cannot be negative"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    maxDiscount: {
      type: Number,
      default: null, // null means no cap
    },
    maxUses: {
      type: Number,
      default: 500, // Max 500 uses per coupon
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    // Track which users have used this coupon
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        orderAmount: {
          type: Number,
        },
        discountGiven: {
          type: Number,
        },
      },
    ],
    // Track which users received this coupon via email
    sentTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        email: {
          type: String,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Virtual to check if coupon is valid
couponSchema.virtual("isValid").get(function () {
  const now = new Date();
  return (
    this.isActive &&
    this.usedCount < this.maxUses &&
    now >= this.validFrom &&
    now <= this.validUntil
  );
});

// Method to check if a user can use this coupon
couponSchema.methods.canBeUsedBy = function (userId) {
  // Check if coupon is valid
  if (!this.isValid) {
    return { canUse: false, reason: "Coupon is no longer valid" };
  }

  // Check if max uses reached
  if (this.usedCount >= this.maxUses) {
    return { canUse: false, reason: "Coupon usage limit reached" };
  }

  // Check if user already used this coupon
  const alreadyUsed = this.usedBy.some(
    (usage) => usage.user.toString() === userId.toString()
  );
  if (alreadyUsed) {
    return { canUse: false, reason: "You have already used this coupon" };
  }

  return { canUse: true };
};

// Method to mark coupon as used by a user
couponSchema.methods.markAsUsed = async function (
  userId,
  orderAmount,
  discountGiven
) {
  this.usedBy.push({
    user: userId,
    usedAt: new Date(),
    orderAmount,
    discountGiven,
  });
  this.usedCount += 1;

  // Auto-deactivate if max uses reached
  if (this.usedCount >= this.maxUses) {
    this.isActive = false;
  }

  await this.save();
};

// Index for efficient querying
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validUntil: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
