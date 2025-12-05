const Profile = require("../models/profile");
const User = require("../models/user");

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await Profile.findOne({ user: userId }).populate(
      "user",
      "name email"
    );

    // If profile doesn't exist, create one with basic info
    if (!profile) {
      const user = await User.findById(userId);
      profile = new Profile({
        user: userId,
        personalInfo: {
          firstName: user.name.split(" ")[0] || "",
          lastName: user.name.split(" ").slice(1).join(" ") || "",
        },
        addresses: [],
        paymentMethods: [],
      });
      await profile.save();
      await profile.populate("user", "name email");
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// Update personal information
const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, dateOfBirth, phone, gender } = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
        personalInfo: {},
        addresses: [],
        paymentMethods: [],
      });
    }

    profile.personalInfo = {
      firstName: firstName || profile.personalInfo.firstName,
      lastName: lastName || profile.personalInfo.lastName,
      dateOfBirth: dateOfBirth || profile.personalInfo.dateOfBirth,
      phone: phone || profile.personalInfo.phone,
      gender: gender || profile.personalInfo.gender,
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update personal info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update personal information",
      error: error.message,
    });
  }
};

// Add new address
const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      type,
      firstName,
      lastName,
      company,
      address,
      apartment,
      city,
      state,
      zipCode,
      country,
      isDefault,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !address || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: firstName, lastName, address, city, state, zipCode",
      });
    }

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
        personalInfo: {},
        addresses: [],
        paymentMethods: [],
      });
    }

    // If this is set as default, unset others
    if (isDefault) {
      profile.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // If it's the first address, make it default
    const newAddress = {
      type: type || "home",
      firstName,
      lastName,
      company,
      address,
      apartment,
      city,
      state,
      zipCode,
      country: country || "United States",
      isDefault: isDefault || profile.addresses.length === 0,
    };

    profile.addresses.push(newAddress);
    await profile.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      profile,
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const updateData = req.body;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const addressIndex = profile.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting as default, unset others
    if (updateData.isDefault) {
      profile.addresses.forEach((addr, index) => {
        if (index !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    // Update address
    Object.assign(profile.addresses[addressIndex], updateData);
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const addressIndex = profile.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = profile.addresses[addressIndex].isDefault;
    profile.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are other addresses, make the first one default
    if (wasDefault && profile.addresses.length > 0) {
      profile.addresses[0].isDefault = true;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      profile,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};

// Add payment method (storing minimal info for security)
const addPaymentMethod = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      cardholderName,
      lastFourDigits,
      expiryMonth,
      expiryYear,
      cardType,
      isDefault,
    } = req.body;

    // Validation
    if (!cardholderName || !lastFourDigits || !expiryMonth || !expiryYear) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: cardholderName, lastFourDigits, expiryMonth, expiryYear",
      });
    }

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
        personalInfo: {},
        addresses: [],
        paymentMethods: [],
      });
    }

    // If this is set as default, unset others
    if (isDefault) {
      profile.paymentMethods.forEach((pm) => {
        pm.isDefault = false;
      });
    }

    const newPaymentMethod = {
      cardholderName,
      lastFourDigits: lastFourDigits.slice(-4), // Ensure only last 4 digits
      expiryMonth,
      expiryYear,
      cardType,
      isDefault: isDefault || profile.paymentMethods.length === 0,
    };

    profile.paymentMethods.push(newPaymentMethod);
    await profile.save();

    res.status(201).json({
      success: true,
      message: "Payment method added successfully",
      profile,
    });
  } catch (error) {
    console.error("Add payment method error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add payment method",
      error: error.message,
    });
  }
};

// Delete payment method
const deletePaymentMethod = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethodId } = req.params;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const paymentMethodIndex = profile.paymentMethods.findIndex(
      (pm) => pm._id.toString() === paymentMethodId
    );

    if (paymentMethodIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    const wasDefault = profile.paymentMethods[paymentMethodIndex].isDefault;
    profile.paymentMethods.splice(paymentMethodIndex, 1);

    // If deleted payment method was default and there are others, make the first one default
    if (wasDefault && profile.paymentMethods.length > 0) {
      profile.paymentMethods[0].isDefault = true;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Payment method deleted successfully",
      profile,
    });
  } catch (error) {
    console.error("Delete payment method error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete payment method",
      error: error.message,
    });
  }
};

// Update preferences
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      emailNotifications,
      smsNotifications,
      marketingEmails,
      currency,
      language,
    } = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
        personalInfo: {},
        addresses: [],
        paymentMethods: [],
      });
    }

    profile.preferences = {
      emailNotifications:
        emailNotifications !== undefined
          ? emailNotifications
          : profile.preferences.emailNotifications,
      smsNotifications:
        smsNotifications !== undefined
          ? smsNotifications
          : profile.preferences.smsNotifications,
      marketingEmails:
        marketingEmails !== undefined
          ? marketingEmails
          : profile.preferences.marketingEmails,
      currency: currency || profile.preferences.currency,
      language: language || profile.preferences.language,
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update preferences",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updatePersonalInfo,
  addAddress,
  updateAddress,
  deleteAddress,
  addPaymentMethod,
  deletePaymentMethod,
  updatePreferences,
};
