import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Shield,
  ArrowLeft,
  CheckCircle,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { clearCart, syncCartPrices } from "../store/cartSlice";
import { getProfile } from "../store/profileSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartQuantity } = useSelector(
    (state) => state.cart
  );
  const { profile } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",

    // Billing same as shipping
    billingAddressSame: true,
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",

    // Order Notes
    orderNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const hasSynced = useRef(false);

  // Sync cart prices with latest product data when component mounts
  useEffect(() => {
    if (cartItems.length > 0 && !hasSynced.current) {
      dispatch(syncCartPrices());
      hasSynced.current = true;
    }
  }, [dispatch, cartItems.length]);

  // Load profile data on mount
  useEffect(() => {
    if (user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  // Pre-populate form with profile data when profile loads
  useEffect(() => {
    if (profile) {
      const defaultAddress = profile.addresses?.find((addr) => addr.isDefault);
      const defaultPayment = profile.paymentMethods?.find((pm) => pm.isDefault);

      if (defaultAddress && !formData.firstName) {
        setFormData((prev) => ({
          ...prev,
          firstName: defaultAddress.firstName,
          lastName: defaultAddress.lastName,
          address: defaultAddress.address,
          apartment: defaultAddress.apartment || "",
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
        }));
      }

      if (defaultPayment && !formData.cardholderName) {
        setFormData((prev) => ({
          ...prev,
          cardholderName: defaultPayment.cardholderName,
        }));
      }

      // Pre-populate email and phone from profile
      if (profile.personalInfo && !formData.email) {
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
          phone: profile.personalInfo.phone || "",
        }));
      }
    }
  }, [
    profile,
    formData.firstName,
    formData.cardholderName,
    formData.email,
    user,
  ]);

  // Redirect to cart if empty
  if (cartItems.length === 0 && !orderComplete) {
    navigate("/cart");
    return null;
  }

  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "cardNumber",
      "expiryDate",
      "cvv",
      "cardholderName",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\d{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Card validation (basic)
    if (
      formData.cardNumber &&
      formData.cardNumber.replace(/\D/g, "").length < 16
    ) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    // CVV validation
    if (formData.cvv && formData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    // Expiry date validation
    if (formData.expiryDate) {
      const [month, year] = formData.expiryDate.split("/");
      const now = new Date();
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < now) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart and show success
      dispatch(clearCart());
      setOrderComplete(true);
    } catch (error) {
      console.error("Payment failed:", error);
      setErrors({ submit: "Payment failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/products")}
              className="w-full btn-primary"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin size={20} />
                      Shipping Information
                    </h2>
                    {profile?.addresses?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const defaultAddr = profile.addresses.find(
                            (addr) => addr.isDefault
                          );
                          if (defaultAddr) {
                            setFormData((prev) => ({
                              ...prev,
                              firstName: defaultAddr.firstName,
                              lastName: defaultAddr.lastName,
                              address: defaultAddr.address,
                              apartment: defaultAddr.apartment || "",
                              city: defaultAddr.city,
                              state: defaultAddr.state,
                              zipCode: defaultAddr.zipCode,
                              country: defaultAddr.country,
                            }));
                          }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Use Saved Address
                      </button>
                    )}
                  </div>
                </div>
                <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.zipCode ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Information
                  </h2>
                </div>
                <div className="px-6 py-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.cardholderName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.cardholderName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          cardNumber: formatted,
                        }));
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.cardNumber ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                          errors.expiryDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                          errors.cvv ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Notes (Optional)
                  </h2>
                </div>
                <div className="px-6 py-6">
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for your order..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Shield size={20} />
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </button>
                {errors.submit && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {errors.submit}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-4">
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => {
                    const discountedPrice = calculateDiscountedPrice(
                      item.price,
                      item.discount
                    );
                    return (
                      <div
                        key={item._id}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={
                            item.image ||
                            item.images?.[0]?.url ||
                            "/placeholder-product.jpg"
                          }
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${discountedPrice.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ${(discountedPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({cartQuantity} items)
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="mt-6 text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-green-600" />
                    <span>SSL Encrypted Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>100% Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
