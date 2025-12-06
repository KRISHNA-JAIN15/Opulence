import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  getOrderById,
  cancelOrder,
  resetOrderState,
} from "../store/orderSlice";

const OrderTracking = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder, isLoading, isError, message } = useSelector(
    (state) => state.order
  );
  const { token } = useSelector((state) => state.auth);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=/orders/" + orderId);
      return;
    }
    dispatch(getOrderById(orderId));

    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch, orderId, token, navigate]);

  const copyOrderNumber = () => {
    if (currentOrder?.orderNumber) {
      navigator.clipboard.writeText(currentOrder.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await dispatch(cancelOrder({ orderId, reason: cancelReason })).unwrap();
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      confirmed: "text-blue-600 bg-blue-100",
      processing: "text-purple-600 bg-purple-100",
      shipped: "text-indigo-600 bg-indigo-100",
      out_for_delivery: "text-orange-600 bg-orange-100",
      delivered: "text-green-600 bg-green-100",
      cancelled: "text-red-600 bg-red-100",
      returned: "text-gray-600 bg-gray-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      returned: "Returned",
    };
    return labels[status] || status;
  };

  const orderSteps = [
    { status: "confirmed", label: "Order Confirmed", icon: CheckCircle },
    { status: "processing", label: "Processing", icon: Package },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const getStepStatus = (stepStatus) => {
    const statusOrder = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(currentOrder?.orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentOrder?.orderStatus === "cancelled") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  const canCancel = () => {
    const nonCancellable = [
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
    ];
    return !nonCancellable.includes(currentOrder?.orderStatus);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isError || !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {message || "Unable to load order details"}
          </p>
          <button onClick={() => navigate("/profile")} className="btn-primary">
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Details
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">
                  Order #{currentOrder.orderNumber}
                </p>
                <button
                  onClick={copyOrderNumber}
                  className="text-gray-400 hover:text-gray-600"
                  title="Copy order number"
                >
                  <Copy size={14} />
                </button>
                {copied && (
                  <span className="text-xs text-green-600">Copied!</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  currentOrder.orderStatus
                )}`}
              >
                {getStatusLabel(currentOrder.orderStatus)}
              </span>
              {canCancel() && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Progress */}
        {currentOrder.orderStatus !== "cancelled" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Progress
            </h2>
            <div className="relative">
              <div className="flex justify-between">
                {orderSteps.map((step) => {
                  const stepStatus = getStepStatus(step.status);
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.status}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          stepStatus === "completed"
                            ? "bg-green-600 text-white"
                            : stepStatus === "current"
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <p
                        className={`text-xs mt-2 text-center max-w-20 ${
                          stepStatus === "upcoming"
                            ? "text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-green-600 transition-all duration-500"
                  style={{
                    width: `${
                      (orderSteps.findIndex(
                        (s) => s.status === currentOrder.orderStatus
                      ) /
                        (orderSteps.length - 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Tracking Info */}
            {currentOrder.tracking?.trackingNumber && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-medium">
                      {currentOrder.tracking.trackingNumber}
                    </p>
                    {currentOrder.tracking.carrier && (
                      <p className="text-sm text-gray-500">
                        via {currentOrder.tracking.carrier}
                      </p>
                    )}
                  </div>
                  {currentOrder.tracking.estimatedDelivery && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Estimated Delivery
                      </p>
                      <p className="font-medium">
                        {new Date(
                          currentOrder.tracking.estimatedDelivery
                        ).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancelled Order Info */}
        {currentOrder.orderStatus === "cancelled" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Order Cancelled</h3>
                <p className="text-red-700 text-sm mt-1">
                  {currentOrder.cancellationReason ||
                    "This order was cancelled."}
                </p>
                {currentOrder.cancelledAt && (
                  <p className="text-red-600 text-xs mt-2">
                    Cancelled on{" "}
                    {new Date(currentOrder.cancelledAt).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items ({currentOrder.items.length})
            </h2>
            <div className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item.image || "/placeholder-product.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{currentOrder.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {currentOrder.pricing.shipping === 0
                    ? "Free"
                    : `₹${currentOrder.pricing.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{currentOrder.pricing.tax.toFixed(2)}</span>
              </div>
              {currentOrder.pricing.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{currentOrder.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{currentOrder.pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Address
              </h2>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">
                  {currentOrder.shippingAddress.firstName}{" "}
                  {currentOrder.shippingAddress.lastName}
                </p>
                <p>{currentOrder.shippingAddress.address}</p>
                {currentOrder.shippingAddress.apartment && (
                  <p>{currentOrder.shippingAddress.apartment}</p>
                )}
                <p>
                  {currentOrder.shippingAddress.city},{" "}
                  {currentOrder.shippingAddress.state}{" "}
                  {currentOrder.shippingAddress.zipCode}
                </p>
                <p>{currentOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span>{currentOrder.contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span>{currentOrder.contact.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {currentOrder.payment.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={`font-medium ${
                      currentOrder.payment.status === "completed"
                        ? "text-green-600"
                        : currentOrder.payment.status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {currentOrder.payment.status.charAt(0).toUpperCase() +
                      currentOrder.payment.status.slice(1)}
                  </span>
                </div>
                {currentOrder.payment.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span>Payment ID</span>
                    <span className="font-mono text-sm">
                      {currentOrder.payment.razorpayPaymentId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Notes */}
            {currentOrder.orderNotes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Notes
                </h2>
                <p className="text-gray-600">{currentOrder.orderNotes}</p>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={20} />
                Order Timeline
              </h2>
              <div className="space-y-4">
                {currentOrder.statusHistory
                  ?.slice()
                  .reverse()
                  .map((history, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getStatusLabel(history.status)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(history.timestamp).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        {history.note && (
                          <p className="text-sm text-gray-600 mt-1">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Order
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Please let us know why you're cancelling..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
