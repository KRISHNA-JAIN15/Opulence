const Coupon = require("../models/coupon");
const User = require("../models/user");
const { sendCouponPromoEmail } = require("../middlewares/email/emailService");

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountAmount,
      minOrderAmount,
      maxDiscount,
      maxUses,
      validFrom,
      validUntil,
      description,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType: discountType || "percentage",
      discountAmount,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || null,
      maxUses: maxUses || 500,
      validFrom: validFrom || new Date(),
      validUntil,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
};

// Get all coupons (admin)
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
    });
  }
};

// Get single coupon
exports.getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("usedBy.user", "name email");

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon",
    });
  }
};

// Validate coupon (for checkout)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.user.id;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Check if coupon can be used
    const { canUse, reason } = coupon.canBeUsedBy(userId);
    if (!canUse) {
      return res.status(400).json({
        success: false,
        message: reason,
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountAmount) / 100;
      // Apply max discount cap if set
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    res.json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        calculatedDiscount: Math.round(discount * 100) / 100,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate coupon",
    });
  }
};

// Apply coupon (mark as used after successful order)
exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount, discountGiven } = req.body;
    const userId = req.user.id;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Check if coupon can be used
    const { canUse, reason } = coupon.canBeUsedBy(userId);
    if (!canUse) {
      return res.status(400).json({
        success: false,
        message: reason,
      });
    }

    // Mark as used
    await coupon.markAsUsed(userId, orderAmount, discountGiven);

    res.json({
      success: true,
      message: "Coupon applied successfully",
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
    });
  }
};

// Send coupon to random 500 verified users
exports.sendCouponToUsers = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Get random 500 verified users who haven't received this coupon yet
    const sentUserIds = coupon.sentTo.map((s) => s.user);

    const users = await User.aggregate([
      {
        $match: {
          isVerified: true,
          type: { $ne: "admin" },
          _id: { $nin: sentUserIds },
        },
      },
      { $sample: { size: 500 } }, // Random 500 users
      { $project: { email: 1, name: 1 } },
    ]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No eligible users found to send coupon to",
      });
    }

    let successCount = 0;
    let failCount = 0;
    const errors = [];
    const sentUsers = [];

    // Send emails with delay to avoid rate limiting
    for (const user of users) {
      try {
        const result = await sendCouponPromoEmail(
          user.email,
          user.name || "Valued Customer",
          coupon.code,
          coupon.discountType === "percentage"
            ? `${coupon.discountAmount}%`
            : `₹${coupon.discountAmount}`
        );

        if (result.success) {
          successCount++;
          sentUsers.push({
            user: user._id,
            email: user.email,
            sentAt: new Date(),
          });
        } else {
          failCount++;
          errors.push({ email: user.email, error: result.error });
        }

        // Small delay to avoid overwhelming email server
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        failCount++;
        errors.push({ email: user.email, error: err.message });
      }
    }

    // Update coupon with sent users
    coupon.sentTo.push(...sentUsers);
    await coupon.save();

    res.json({
      success: true,
      message: `Coupon emails sent successfully`,
      stats: {
        total: users.length,
        success: successCount,
        failed: failCount,
      },
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Only show first 10 errors
    });
  } catch (error) {
    console.error("Error sending coupon emails:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send coupon emails",
    });
  }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
  try {
    const {
      discountType,
      discountAmount,
      minOrderAmount,
      maxDiscount,
      maxUses,
      validFrom,
      validUntil,
      description,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Update fields
    if (discountType) coupon.discountType = discountType;
    if (discountAmount !== undefined) coupon.discountAmount = discountAmount;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (maxUses !== undefined) coupon.maxUses = maxUses;
    if (validFrom) coupon.validFrom = validFrom;
    if (validUntil) coupon.validUntil = validUntil;
    if (description !== undefined) coupon.description = description;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    res.json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update coupon",
    });
  }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
    });
  }
};

// Get coupon statistics
exports.getCouponStats = async (req, res) => {
  try {
    const stats = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: 1 },
          activeCoupons: {
            $sum: { $cond: ["$isActive", 1, 0] },
          },
          totalUsed: { $sum: "$usedCount" },
          totalSent: { $sum: { $size: "$sentTo" } },
        },
      },
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalCoupons: 0,
        activeCoupons: 0,
        totalUsed: 0,
        totalSent: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching coupon stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon statistics",
    });
  }
};
