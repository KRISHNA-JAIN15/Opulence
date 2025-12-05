const express = require("express");
const {
  getProfile,
  updatePersonalInfo,
  addAddress,
  updateAddress,
  deleteAddress,
  addPaymentMethod,
  deletePaymentMethod,
  updatePreferences,
} = require("../controllers/profile");
const { authenticateToken } = require("../middlewares/auth/auth");

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Profile routes
router.route("/").get(getProfile);

router.route("/personal-info").put(updatePersonalInfo);

router.route("/addresses").post(addAddress);

router.route("/addresses/:addressId").put(updateAddress).delete(deleteAddress);

router.route("/payment-methods").post(addPaymentMethod);

router.route("/payment-methods/:paymentMethodId").delete(deletePaymentMethod);

router.route("/preferences").put(updatePreferences);

module.exports = router;
