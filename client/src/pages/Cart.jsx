import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  updateCartQuantity,
  clearCart,
  syncCartPrices,
} from "../store/cartSlice";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartQuantity } = useSelector(
    (state) => state.cart
  );
  const { token } = useSelector((state) => state.auth);
  const [updatingItems, setUpdatingItems] = useState({});
  const hasSynced = useRef(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Sync cart prices with latest product data when component mounts
  useEffect(() => {
    if (cartItems.length > 0 && !hasSynced.current) {
      dispatch(syncCartPrices());
      hasSynced.current = true;
    }
  }, [dispatch, cartItems.length]);

  const handleQuantityChange = (productId, newQuantity, maxStock) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else if (newQuantity <= maxStock) {
      dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleIncrement = (productId, currentQuantity, maxStock) => {
    if (currentQuantity < maxStock) {
      setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
      dispatch(incrementQuantity(productId));
      setTimeout(() => {
        setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
      }, 200);
    }
  };

  const handleDecrement = (productId) => {
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
    dispatch(decrementQuantity(productId));
    setTimeout(() => {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }, 200);
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-8">
              <ShoppingCart size={64} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="space-y-4">
              <Link
                to="/products"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Start Shopping
              </Link>
              <div>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Home
                </Link>
              </div>
            </div>
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
          <p className="text-gray-600">
            {cartQuantity} {cartQuantity === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const discountedPrice = calculateDiscountedPrice(
                    item.price,
                    item.discount
                  );
                  const isUpdating = updatingItems[item._id];

                  return (
                    <div
                      key={item._id}
                      className={`p-6 cart-item-animation ${
                        isUpdating ? "cart-item-updating" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="shrink-0">
                          <img
                            src={
                              item.image ||
                              item.images?.[0]?.url ||
                              "/placeholder-product.jpg"
                            }
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                                <Link
                                  to={`/products/${item._id}`}
                                  className="hover:text-gray-700"
                                >
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2 break-words max-w-md">
                                {item.description}
                              </p>
                              <div className="mt-2">
                                <span className="text-sm text-gray-500">
                                  Category: {item.category}
                                </span>
                              </div>

                              {/* Stock Status */}
                              <div className="mt-2">
                                {item.inStock <= 5 && item.inStock > 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Only {item.inStock} left in stock
                                  </span>
                                )}
                                {item.inStock === 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          {/* Price and Quantity Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            {/* Price */}
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              {item.discount > 0 && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    ${item.price.toFixed(2)}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {item.discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleDecrement(item._id)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus size={16} />
                              </button>

                              <input
                                type="number"
                                min="1"
                                max={item.inStock}
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value);
                                  if (!isNaN(newQuantity)) {
                                    handleQuantityChange(
                                      item._id,
                                      newQuantity,
                                      item.inStock
                                    );
                                  }
                                }}
                                className="cart-quantity-input w-16 text-center border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              />

                              <button
                                onClick={() =>
                                  handleIncrement(
                                    item._id,
                                    item.quantity,
                                    item.inStock
                                  )
                                }
                                disabled={
                                  item.quantity >= item.inStock || isUpdating
                                }
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="mt-3 text-right">
                            <span className="text-lg font-semibold text-gray-900">
                              Subtotal: $
                              {(discountedPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cartQuantity} items)
                  </span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                {/* Estimated Tax */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">
                    ${(cartTotal * 0.08).toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(cartTotal + cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="pt-4">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                  >
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </button>
                </div>

                {/* Security Note */}
                <div className="text-xs text-gray-500 text-center">
                  <p>🔒 Your payment information is secure and encrypted</p>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Promo Code
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
