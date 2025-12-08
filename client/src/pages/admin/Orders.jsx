import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  getAllOrders,
  updateOrderStatus,
  resetOrderState,
  syncAdminOrders,
} from "../../store/orderSlice";
import {
  Package,
  Search,
  Eye,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Filter,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// Auto-refresh interval in milliseconds (5 seconds)
const SYNC_INTERVAL = 5000;

const AdminOrders = () => {
  const dispatch = useDispatch();
  const {
    adminOrders,
    isLoading,
    adminPagination,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.order);
  const { user, token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updateModal, setUpdateModal] = useState({ show: false, order: null });
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [newOrderCount, setNewOrderCount] = useState(0);

  // Refs for auto-refresh
  const syncIntervalRef = useRef(null);
  const previousOrderCountRef = useRef(0);
  const isFirstSyncRef = useRef(true);

  // Initial load
  useEffect(() => {
    dispatch(getAllOrders({ page: 1, limit: 20, status: statusFilter }));
    return () => dispatch(resetOrderState());
  }, [dispatch, statusFilter]);

  // Auto-refresh orders silently every 5 seconds
  const syncOrders = useCallback(async () => {
    if (!token) return;

    try {
      const statusQuery = statusFilter ? `&status=${statusFilter}` : "";
      const response = await axios.get(
        `http://localhost:3000/api/orders/admin/all?page=${
          adminPagination?.page || 1
        }&limit=20${statusQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedOrders = response.data.orders || [];
      const fetchedTotal = response.data.pagination?.total || 0;

      // Check for new orders (only after first sync)
      if (!isFirstSyncRef.current) {
        const currentTotal = previousOrderCountRef.current;
        if (fetchedTotal > currentTotal) {
          const newCount = fetchedTotal - currentTotal;
          setNewOrderCount((prev) => prev + newCount);
          setNotification({
            show: true,
            type: "success",
            message: `${newCount} new order${
              newCount > 1 ? "s" : ""
            } received!`,
          });
          setTimeout(
            () => setNotification({ show: false, type: "", message: "" }),
            3000
          );
        }
      }

      isFirstSyncRef.current = false;
      previousOrderCountRef.current = fetchedTotal;

      // Update orders in Redux store silently
      dispatch(
        syncAdminOrders({
          orders: fetchedOrders,
          pagination: response.data.pagination,
        })
      );
    } catch (error) {
      // Silently fail - don't show errors for background sync
      console.error("Order sync error:", error.message);
    }
  }, [token, statusFilter, adminPagination?.page, dispatch]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (!token || user?.type !== "admin") return;

    // Run initial sync after a short delay
    const initialTimeout = setTimeout(syncOrders, 1000);

    // Set up interval for continuous sync
    syncIntervalRef.current = setInterval(syncOrders, SYNC_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [token, user?.type, syncOrders]);

  useEffect(() => {
    if (isSuccess && message) {
      setNotification({ show: true, type: "success", message });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000
      );
    }
    if (isError && message) {
      setNotification({ show: true, type: "error", message });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000
      );
    }
  }, [isSuccess, isError, message]);

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "returned",
      label: "Returned",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "return_pending",
      label: "Return Pending",
      color: "bg-amber-100 text-amber-800",
    },
    {
      value: "return_approved",
      label: "Return Approved",
      color: "bg-cyan-100 text-cyan-800",
    },
    {
      value: "return_in_transit",
      label: "Return In Transit",
      color: "bg-violet-100 text-violet-800",
    },
    {
      value: "return_received",
      label: "Return Received",
      color: "bg-teal-100 text-teal-800",
    },
    {
      value: "return_completed",
      label: "Return Completed",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      value: "return_rejected",
      label: "Return Rejected",
      color: "bg-rose-100 text-rose-800",
    },
  ];

  // Get allowed status transitions based on current status
  const getAllowedStatuses = (currentStatus, hasReturnRequest) => {
    // If there's an active return request, don't allow status changes
    if (hasReturnRequest) {
      return [];
    }

    // Define valid transitions for each status
    const transitions = {
      pending: ["confirmed", "processing", "cancelled"],
      confirmed: ["processing", "shipped", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["out_for_delivery", "delivered"],
      out_for_delivery: ["delivered"],
      delivered: [], // No changes allowed after delivery (returns handled separately)
      cancelled: [], // No changes allowed after cancellation
      returned: [], // No changes allowed after return
    };

    return transitions[currentStatus] || [];
  };

  // Filter status options for the update modal
  const getAvailableStatusOptions = (order) => {
    if (!order) return [];

    const hasActiveReturn =
      order.returnRequest?.isRequested &&
      !["completed", "rejected"].includes(order.returnRequest?.status);

    const allowedStatuses = getAllowedStatuses(
      order.orderStatus,
      hasActiveReturn
    );

    return statusOptions.filter(
      (opt) =>
        allowedStatuses.includes(opt.value) && !opt.value.startsWith("return_")
    );
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "confirmed":
        return <CheckCircle size={16} />;
      case "processing":
        return <Package size={16} />;
      case "shipped":
      case "out_for_delivery":
        return <Truck size={16} />;
      case "delivered":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      case "returned":
        return <RefreshCw size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getReturnStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800",
      approved: "bg-cyan-100 text-cyan-800",
      in_transit: "bg-violet-100 text-violet-800",
      received: "bg-teal-100 text-teal-800",
      completed: "bg-emerald-100 text-emerald-800",
      rejected: "bg-rose-100 text-rose-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getReturnStatusLabel = (status) => {
    const labels = {
      pending: "Return Pending",
      approved: "Return Approved",
      in_transit: "Return In Transit",
      received: "Return Received",
      completed: "Return Completed",
      rejected: "Return Rejected",
    };
    return labels[status] || `Return ${status}`;
  };

  const filteredOrders =
    adminOrders?.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower) ||
        order.contact?.email?.toLowerCase().includes(searchLower)
      );
    }) || [];

  const openUpdateModal = (order) => {
    setUpdateModal({ show: true, order });
    setNewStatus(order.orderStatus);
    setStatusNote("");
    setTrackingNumber(order.tracking?.trackingNumber || "");
    setCarrier(order.tracking?.carrier || "");
    setEstimatedDelivery(
      order.tracking?.estimatedDelivery
        ? new Date(order.tracking.estimatedDelivery).toISOString().split("T")[0]
        : ""
    );
  };

  const closeUpdateModal = () => {
    setUpdateModal({ show: false, order: null });
    setNewStatus("");
    setStatusNote("");
    setTrackingNumber("");
    setCarrier("");
    setEstimatedDelivery("");
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    const updateData = {
      orderId: updateModal.order._id,
      status: newStatus,
      note: statusNote || undefined,
    };

    // Add tracking info if status is shipped
    if (newStatus === "shipped" || newStatus === "out_for_delivery") {
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (carrier) updateData.carrier = carrier;
      if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
    }

    await dispatch(updateOrderStatus(updateData));
    closeUpdateModal();
    dispatch(
      getAllOrders({
        page: adminPagination.page,
        limit: 20,
        status: statusFilter,
      })
    );
  };

  const handleReturnStatusUpdate = async (orderId, status) => {
    try {
      const endpoint = `http://localhost:3000/api/orders/admin/${orderId}/return-status`;
      const method = "PUT";
      let body = { status };

      // Add admin notes for rejected status
      if (status === "rejected") {
        body.adminNotes = "Return request rejected";
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update return status");
      }

      setNotification({
        show: true,
        type: "success",
        message: `Return ${
          status === "completed"
            ? "completed and refund processed"
            : status === "rejected"
            ? "rejected"
            : `marked as ${status.replace("_", " ")}`
        }`,
      });

      // Refresh orders
      dispatch(
        getAllOrders({
          page: adminPagination.page,
          limit: 20,
          status: statusFilter,
        })
      );
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        message: error.message || "Failed to update return status",
      });
    }
  };

  const handlePageChange = (page) => {
    dispatch(getAllOrders({ page, limit: 20, status: statusFilter }));
  };

  if (user?.type !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide">
              Order Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and update order statuses to keep customers informed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* {newOrderCount > 0 && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">
                  {newOrderCount} new order{newOrderCount > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setNewOrderCount(0)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X size={16} />
                </button>
              </div>
            )} */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw size={16} className="animate-spin-slow" />
              <span>Auto-refreshing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            >
              <option value="">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Orders ({adminPagination?.total || 0})
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-6">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-gray-900">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {getStatusLabel(order.orderStatus)}
                      </span>
                      {order.returnRequest?.isRequested && (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getReturnStatusColor(
                            order.returnRequest.status
                          )}`}
                        >
                          <RefreshCw size={14} />
                          {getReturnStatusLabel(order.returnRequest.status)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Customer:</span>{" "}
                        {order.user?.name ||
                          order.shippingAddress?.firstName +
                            " " +
                            order.shippingAddress?.lastName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {order.user?.email || order.contact?.email}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.pricing?.total?.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length} item(s)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openUpdateModal(order)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order._id ? null : order._id
                          )
                        }
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        {expandedOrder === order._id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <img
                                src={item.image || "/placeholder-product.jpg"}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity} × ₹
                                  {item.price?.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-medium text-gray-900 text-sm">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900">
                            {order.shippingAddress?.firstName}{" "}
                            {order.shippingAddress?.lastName}
                          </p>
                          <p>{order.shippingAddress?.address}</p>
                          {order.shippingAddress?.apartment && (
                            <p>{order.shippingAddress.apartment}</p>
                          )}
                          <p>
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state}{" "}
                            {order.shippingAddress?.zipCode}
                          </p>
                          <p>{order.shippingAddress?.country}</p>
                          <p className="mt-2">
                            <span className="font-medium">Phone:</span>{" "}
                            {order.contact?.phone}
                          </p>
                        </div>

                        {/* Tracking Info */}
                        {order.tracking?.trackingNumber && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Tracking Info
                            </h4>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Tracking #:</span>{" "}
                              {order.tracking.trackingNumber}
                            </p>
                            {order.tracking.carrier && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Carrier:</span>{" "}
                                {order.tracking.carrier}
                              </p>
                            )}
                            {order.tracking.estimatedDelivery && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                  Est. Delivery:
                                </span>{" "}
                                {new Date(
                                  order.tracking.estimatedDelivery
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status History */}
                    {order.statusHistory?.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Status History
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {order.statusHistory.map((history, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-lg px-3 py-2 text-sm"
                            >
                              <span className="font-medium">
                                {getStatusLabel(history.status)}
                              </span>
                              <span className="text-gray-500 ml-2">
                                {new Date(history.timestamp).toLocaleDateString(
                                  "en-IN",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {history.note && (
                                <p className="text-gray-600 text-xs mt-1">
                                  {history.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Return Request Info */}
                    {order.returnRequest?.isRequested && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <RefreshCw size={16} className="text-orange-500" />
                          Return Request
                        </h4>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    order.returnRequest.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.returnRequest.status ===
                                        "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : order.returnRequest.status ===
                                        "received"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {order.returnRequest.status
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    order.returnRequest.status?.slice(1)}
                                </span>
                              </p>
                              <p className="text-gray-600 mt-1">
                                <span className="font-medium">Requested:</span>{" "}
                                {new Date(
                                  order.returnRequest.requestedAt
                                ).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-gray-600 mt-1">
                                <span className="font-medium">Reason:</span>{" "}
                                {order.returnRequest.reason ||
                                  "No reason provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  Refund Amount:
                                </span>{" "}
                                ₹
                                {order.returnRequest.refundAmount?.toFixed(2) ||
                                  order.pricing?.total?.toFixed(2)}
                              </p>
                              {order.returnRequest.estimatedPickup && (
                                <p className="text-gray-600 mt-1">
                                  <span className="font-medium">
                                    Est. Pickup:
                                  </span>{" "}
                                  {new Date(
                                    order.returnRequest.estimatedPickup
                                  ).toLocaleDateString("en-IN")}
                                </p>
                              )}
                              {order.returnRequest.receivedAt && (
                                <p className="text-gray-600 mt-1">
                                  <span className="font-medium">Received:</span>{" "}
                                  {new Date(
                                    order.returnRequest.receivedAt
                                  ).toLocaleDateString("en-IN")}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Return Action Buttons */}
                          {order.returnRequest.status !== "completed" &&
                            order.returnRequest.status !== "rejected" && (
                              <div className="mt-4 pt-4 border-t border-orange-200 flex flex-wrap gap-2">
                                {order.returnRequest.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleReturnStatusUpdate(
                                          order._id,
                                          "approved"
                                        )
                                      }
                                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    >
                                      Approve Return
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleReturnStatusUpdate(
                                          order._id,
                                          "rejected"
                                        )
                                      }
                                      className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    >
                                      Reject Return
                                    </button>
                                  </>
                                )}
                                {order.returnRequest.status === "approved" && (
                                  <button
                                    onClick={() =>
                                      handleReturnStatusUpdate(
                                        order._id,
                                        "in_transit"
                                      )
                                    }
                                    className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                  >
                                    Mark In Transit
                                  </button>
                                )}
                                {order.returnRequest.status ===
                                  "in_transit" && (
                                  <button
                                    onClick={() =>
                                      handleReturnStatusUpdate(
                                        order._id,
                                        "received"
                                      )
                                    }
                                    className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                                  >
                                    Mark Received
                                  </button>
                                )}
                                {order.returnRequest.status === "received" && (
                                  <button
                                    onClick={() =>
                                      handleReturnStatusUpdate(
                                        order._id,
                                        "completed"
                                      )
                                    }
                                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                  >
                                    Complete & Refund
                                  </button>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        )}

        {/* Pagination */}
        {adminPagination?.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
            {Array.from({ length: adminPagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    page === adminPagination.page
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {updateModal.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-lg max-w-lg w-full mx-4 p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Order Status
              </h3>
              <button
                onClick={closeUpdateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Order #{updateModal.order?.orderNumber}
              </p>
              <p className="text-sm text-gray-600">
                Current Status:{" "}
                <span
                  className={`font-medium ${getStatusColor(
                    updateModal.order?.orderStatus
                  )} px-2 py-0.5 rounded`}
                >
                  {getStatusLabel(updateModal.order?.orderStatus)}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              {/* New Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                {getAvailableStatusOptions(updateModal.order).length > 0 ? (
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  >
                    <option value="">Select new status...</option>
                    {getAvailableStatusOptions(updateModal.order).map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-gray-600 text-sm">
                      {updateModal.order?.returnRequest?.isRequested &&
                      !["completed", "rejected"].includes(
                        updateModal.order?.returnRequest?.status
                      )
                        ? "Status cannot be changed while a return is in progress."
                        : updateModal.order?.orderStatus === "delivered"
                        ? "Order has been delivered. No further status changes allowed."
                        : updateModal.order?.orderStatus === "cancelled"
                        ? "Order has been cancelled. No status changes allowed."
                        : updateModal.order?.orderStatus === "returned"
                        ? "Order has been returned. No status changes allowed."
                        : "No status changes available for this order."}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="Add a note about this status change..."
                />
              </div>

              {/* Tracking Info (for shipped status) */}
              {(newStatus === "shipped" ||
                newStatus === "out_for_delivery") && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Tracking Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carrier
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="e.g., FedEx, DHL, BlueDart"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeUpdateModal}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={
                  isLoading ||
                  !newStatus ||
                  getAvailableStatusOptions(updateModal.order).length === 0
                }
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
