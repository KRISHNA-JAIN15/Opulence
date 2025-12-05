const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["home", "work", "other"],
    default: "home",
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  apartment: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    default: "United States",
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal"],
    default: "credit_card",
  },
  cardholderName: {
    type: String,
    required: true,
    trim: true,
  },
  lastFourDigits: {
    type: String,
    required: true,
    maxlength: 4,
  },
  expiryMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  expiryYear: {
    type: Number,
    required: true,
  },
  cardType: {
    type: String,
    enum: ["visa", "mastercard", "amex", "discover"],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  // Don't store actual card numbers or CVV for security
});

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalInfo: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      dateOfBirth: {
        type: Date,
      },
      phone: {
        type: String,
        trim: true,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
      },
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      marketingEmails: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      language: {
        type: String,
        default: "en",
      },
    },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    orderHistory: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        orderDate: {
          type: Date,
          default: Date.now,
        },
        totalAmount: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        },
      },
    ],
    wishlist: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure only one default address and payment method
profileSchema.pre("save", function (next) {
  // Ensure only one default address
  const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);
  if (defaultAddresses.length > 1) {
    this.addresses.forEach((addr, index) => {
      if (index > 0 && addr.isDefault) {
        addr.isDefault = false;
      }
    });
  }

  // Ensure only one default payment method
  const defaultPaymentMethods = this.paymentMethods.filter(
    (pm) => pm.isDefault
  );
  if (defaultPaymentMethods.length > 1) {
    this.paymentMethods.forEach((pm, index) => {
      if (index > 0 && pm.isDefault) {
        pm.isDefault = false;
      }
    });
  }

  next();
});

// Index for faster queries
profileSchema.index({ user: 1 });

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
