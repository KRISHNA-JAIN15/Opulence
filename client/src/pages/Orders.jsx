import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { getUserOrders } from "../store/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, isLoading, pagination } = useSelector((state) => state.order);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=/orders");
      return;
    }
    dispatch(getUserOrders({ page: 1, limit: 10 }));
  }, [dispatch, token, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {formatStatus(order.orderStatus)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Order #{order.orderNumber}</span>
                      <span>•</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image || "/placeholder-product.jpg"}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg border-2 border-white shadow-sm"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-14 h-14 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {order.items.map((item) => item.name).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{order.pricing.total.toFixed(2)}
                        </p>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.orderStatus === "shipped" &&
                    order.tracking?.estimatedDelivery && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <Truck className="inline-block w-4 h-4 mr-1" />
                          Expected delivery:{" "}
                          <span className="font-medium">
                            {new Date(
                              order.tracking.estimatedDelivery
                            ).toLocaleDateString("en-IN", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </p>
                      </div>
                    )}

                  {order.orderStatus === "delivered" && order.deliveredAt && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-green-600">
                        <CheckCircle className="inline-block w-4 h-4 mr-1" />
                        Delivered on:{" "}
                        <span className="font-medium">
                          {new Date(order.deliveredAt).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    dispatch(
                      getUserOrders({ page: pagination.page - 1, limit: 10 })
                    )
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.pages ||
                        Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, idx, arr) => (
                      <>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span key={`ellipsis-${page}`} className="px-2">
                            ...
                          </span>
                        )}
                        <button
                          key={page}
                          onClick={() =>
                            dispatch(getUserOrders({ page, limit: 10 }))
                          }
                          className={`px-4 py-2 rounded-md ${
                            pagination.page === page
                              ? "bg-black text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </>
                    ))}
                </div>
                <button
                  onClick={() =>
                    dispatch(
                      getUserOrders({ page: pagination.page + 1, limit: 10 })
                    )
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Looks like you haven't placed any orders yet. Start shopping to
              see your orders here.
            </p>
            <Link to="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
