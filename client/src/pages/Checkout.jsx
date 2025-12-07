import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Shield,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Package,
  Wallet,
} from "lucide-react";
import { clearCart, syncCartPrices } from "../store/cartSlice";
import { getProfile } from "../store/profileSlice";
import { getBalance } from "../store/authSlice";
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  createWalletOrder,
  resetOrderState,
} from "../store/orderSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartQuantity } = useSelector(
    (state) => state.cart
  );
  const { profile } = useSelector((state) => state.profile);
  const { user, token, balance } = useSelector((state) => state.auth);
  const {
    razorpayKey,
    isPaymentLoading,
    isSuccess,
    currentOrder,
    isError,
    message,
  } = useSelector((state) => state.order);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [useWallet, setUseWallet] = useState(false);

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
    country: "India",

    // Order Notes
    orderNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const hasSynced = useRef(false);

  // Sync cart prices with latest product data when component mounts
  useEffect(() => {
    if (cartItems.length > 0 && !hasSynced.current) {
      dispatch(syncCartPrices());
      hasSynced.current = true;
    }
  }, [dispatch, cartItems.length]);

  // Load profile data and Razorpay key on mount
  useEffect(() => {
    if (user && token) {
      dispatch(getProfile());
      dispatch(getRazorpayKey());
      dispatch(getBalance());
    }
  }, [dispatch, user, token]);

  // Pre-populate form with profile data when profile loads
  useEffect(() => {
    if (profile) {
      const defaultAddress = profile.addresses?.find((addr) => addr.isDefault);

      // Set selected address
      if (defaultAddress && !selectedAddressId) {
        setSelectedAddressId(defaultAddress._id);
      }

      // Pre-populate email and phone from profile
      if (profile.personalInfo && !formData.email) {
        setFormData((prev) => ({
          ...prev,
          email: user?.email || "",
          phone: profile.personalInfo.phone || "",
        }));
      }

      // If no saved addresses, enable new address form
      if (!profile.addresses || profile.addresses.length === 0) {
        setUseNewAddress(true);
      }
    }
  }, [profile, selectedAddressId, formData.email, user]);

  // Handle successful order
  useEffect(() => {
    if (isSuccess && currentOrder) {
      setOrderComplete(true);
      setCompletedOrder(currentOrder);
      dispatch(clearCart());
      dispatch(resetOrderState());
    }
  }, [isSuccess, currentOrder, dispatch]);

  // Handle order error
  useEffect(() => {
    if (isError && message) {
      setErrors({ submit: message });
      setIsProcessing(false);
      dispatch(resetOrderState());
    }
  }, [isError, message, dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=checkout");
    }
  }, [token, navigate]);

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [cartItems.length, orderComplete, navigate]);

  // Show loading while redirecting
  if (!token || (cartItems.length === 0 && !orderComplete)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const shipping = 0; // Free shipping
  const totalBeforeWallet = subtotal + tax + shipping;
  
  // Calculate wallet amount to use
  const walletBalance = balance || 0;
  const walletAmountToUse = useWallet ? Math.min(walletBalance, totalBeforeWallet) : 0;
  const total = totalBeforeWallet - walletAmountToUse;
  const isFullWalletPayment = useWallet && walletAmountToUse >= totalBeforeWallet;

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

    // Email and phone are always required
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Validate address - either selected or new
    if (!selectedAddressId && !useNewAddress) {
      newErrors.address = "Please select an address or add a new one";
    }

    if (useNewAddress) {
      const requiredAddressFields = [
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "zipCode",
      ];

      requiredAddressFields.forEach((field) => {
        if (!formData[field].trim()) {
          newErrors[field] = "This field is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      // Get shipping address
      const selectedAddress = selectedAddressId
        ? profile.addresses.find((addr) => addr._id === selectedAddressId)
        : null;

      // Extract only the required shipping address fields
      const shippingAddress = selectedAddress
        ? {
            firstName: selectedAddress.firstName,
            lastName: selectedAddress.lastName,
            address: selectedAddress.address,
            apartment: selectedAddress.apartment || "",
            city: selectedAddress.city,
            state: selectedAddress.state,
            zipCode: selectedAddress.zipCode,
            country: selectedAddress.country || "India",
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            apartment: "",
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          };

      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price:
            item.discount > 0
              ? item.price * (1 - item.discount / 100)
              : item.price,
          quantity: item.quantity,
          image: item.image || item.images?.[0]?.url,
        })),
        shippingAddress,
        email: formData.email,
        phone: formData.phone,
        subtotal,
        tax,
        shipping,
        total: totalBeforeWallet,
        walletAmountUsed: walletAmountToUse,
        orderNotes: formData.orderNotes,
      };

      // Case 1: Full wallet payment - no Razorpay needed
      if (isFullWalletPayment) {
        await dispatch(createWalletOrder(orderData)).unwrap();
        dispatch(getBalance()); // Refresh balance
        return;
      }

      // Case 2 & 3: Need Razorpay (partial wallet or no wallet)
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrors({
          submit: "Failed to load payment gateway. Please try again.",
        });
        setIsProcessing(false);
        return;
      }

      // Create Razorpay order for the remaining amount after wallet
      const amountToPay = total; // This is already totalBeforeWallet - walletAmountToUse
      const orderResult = await dispatch(createRazorpayOrder(amountToPay)).unwrap();

      if (!orderResult.orderId) {
        setErrors({
          submit: "Failed to create payment order. Please try again.",
        });
        setIsProcessing(false);
        return;
      }

      // Razorpay options
      const options = {
        key: razorpayKey,
        amount: orderResult.amount,
        currency: orderResult.currency || "INR",
        name: "Opulence",
        description: walletAmountToUse > 0 
          ? `Order Payment (₹${walletAmountToUse.toFixed(2)} from wallet)` 
          : "Order Payment",
        order_id: orderResult.orderId,
        handler: async function (response) {
          try {
            // Verify payment and create order
            await dispatch(
              verifyPaymentAndCreateOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData,
              })
            ).unwrap();
            dispatch(getBalance()); // Refresh balance after order
          } catch (error) {
            setErrors({ submit: error || "Payment verification failed" });
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingAddress.firstName + " " + shippingAddress.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: shippingAddress.address,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        setErrors({
          submit:
            response.error.description || "Payment failed. Please try again.",
        });
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({
        submit: error.message || "Payment failed. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  if (orderComplete && completedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-lg font-bold text-gray-900">
              {completedOrder.orderNumber}
            </p>
            <p className="text-sm text-gray-600 mt-2">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{completedOrder.total?.toFixed(2)}
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/orders/${completedOrder._id}`)}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Package size={20} />
              Track Order
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
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
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={20} />
                    Shipping Information
                  </h2>
                </div>
                <div className="px-6 py-6 space-y-6">
                  {/* Email and Phone - Always shown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  {/* Saved Addresses */}
                  {profile?.addresses && profile.addresses.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Shipping Address
                      </label>
                      <div className="space-y-3">
                        {profile.addresses.map((addr) => (
                          <div
                            key={addr._id}
                            onClick={() => {
                              setSelectedAddressId(addr._id);
                              setUseNewAddress(false);
                            }}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedAddressId === addr._id
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="selectedAddress"
                                    checked={selectedAddressId === addr._id}
                                    onChange={() => {}}
                                    className="w-4 h-4 text-black focus:ring-black"
                                  />
                                  <p className="font-medium text-gray-900">
                                    {addr.firstName} {addr.lastName}
                                  </p>
                                  {addr.isDefault && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 ml-6">
                                  {addr.address}
                                  {addr.apartment && `, ${addr.apartment}`}
                                  <br />
                                  {addr.city}, {addr.state} {addr.zipCode}
                                  <br />
                                  {addr.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add New Address Option */}
                        <div
                          onClick={() => {
                            setUseNewAddress(true);
                            setSelectedAddressId(null);
                          }}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            useNewAddress
                              ? "border-black bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={useNewAddress}
                              onChange={() => {}}
                              className="w-4 h-4 text-black focus:ring-black"
                            />
                            <p className="font-medium text-gray-900">
                              Add New Address
                            </p>
                          </div>
                        </div>
                      </div>
                      {errors.address && !useNewAddress && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  )}

                  {/* New Address Form */}
                  {(useNewAddress ||
                    !profile?.addresses ||
                    profile.addresses.length === 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
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
                            errors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
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
                            errors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.lastName}
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
                            errors.address
                              ? "border-red-500"
                              : "border-gray-300"
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
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
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
                            errors.zipCode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Method
                  </h2>
                </div>
                <div className="px-6 py-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://razorpay.com/assets/razorpay-logo.svg"
                        alt="Razorpay"
                        className="h-6"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Pay securely with Razorpay
                        </p>
                        <p className="text-sm text-gray-600">
                          Credit/Debit Cards, UPI, Net Banking, Wallets
                        </p>
                      </div>
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
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing || isPaymentLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing || isPaymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : isFullWalletPayment ? (
                    <>
                      <Wallet size={20} />
                      Pay with Wallet ₹{total.toFixed(2)}
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      {walletAmountToUse > 0 
                        ? `Pay ₹${total.toFixed(2)} (+ ₹${walletAmountToUse.toFixed(2)} wallet)`
                        : `Pay ₹${total.toFixed(2)}`}
                    </>
                  )}
                </button>
                {errors.submit && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {errors.submit}
                  </p>
                )}
              </div>
            </div>
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
                            Qty: {item.quantity} × ₹{discountedPrice.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{(discountedPrice * item.quantity).toFixed(2)}
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
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>

                  {/* Wallet Balance Section */}
                  {walletBalance > 0 && (
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wallet size={18} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Wallet Balance</span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">₹{walletBalance.toFixed(2)}</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={(e) => setUseWallet(e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            Use Wallet Balance
                          </span>
                          {useWallet && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {isFullWalletPayment 
                                ? "Full payment from wallet" 
                                : `₹${walletAmountToUse.toFixed(2)} from wallet, ₹${total.toFixed(2)} via Razorpay`}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Wallet Deduction */}
                  {useWallet && walletAmountToUse > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Wallet Deduction</span>
                      <span className="font-medium">-₹{walletAmountToUse.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span>{isFullWalletPayment ? "Pay from Wallet" : "Amount to Pay"}</span>
                    <span className={isFullWalletPayment ? "text-green-600" : ""}>
                      ₹{total.toFixed(2)}
                    </span>
                  </div>

                  {isFullWalletPayment && (
                    <p className="text-xs text-green-600 text-center">
                      ✓ Your wallet balance covers the full amount!
                    </p>
                  )}
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
