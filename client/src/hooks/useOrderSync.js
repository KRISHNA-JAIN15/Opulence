import { useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { syncUserOrders } from "../store/orderSlice";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
}/orders`;

// Sync interval in milliseconds (5 seconds for orders list)
const SYNC_INTERVAL = 5000;

/**
 * Custom hook to sync order status in real-time
 * Runs every 3 seconds and updates the current order
 * Shows toast notifications for status changes
 */
export function useOrderSync(orderId, toast) {
  const intervalRef = useRef(null);
  const previousStatusRef = useRef(null);
  const isFirstRun = useRef(true);

  // Get auth token
  const { token } = useSelector((state) => state.auth);

  // Status labels for notifications
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

  // Check for changes and show toasts
  const checkForChangesAndNotify = useCallback(
    (updatedOrder) => {
      if (!toast || isFirstRun.current) {
        // Store initial data without showing toasts
        previousStatusRef.current = {
          orderStatus: updatedOrder.orderStatus,
          trackingNumber: updatedOrder.tracking?.trackingNumber,
          estimatedDelivery: updatedOrder.tracking?.estimatedDelivery,
        };
        isFirstRun.current = false;
        return false;
      }

      const prev = previousStatusRef.current;
      let hasChanges = false;

      if (prev) {
        // Check for status changes
        if (prev.orderStatus !== updatedOrder.orderStatus) {
          hasChanges = true;
          const newStatus = updatedOrder.orderStatus;

          if (newStatus === "delivered") {
            toast.success(`🎉 Your order has been delivered!`);
          } else if (newStatus === "shipped") {
            toast.success(`📦 Your order has been shipped!`);
          } else if (newStatus === "out_for_delivery") {
            toast.success(`🚚 Your order is out for delivery!`);
          } else if (newStatus === "cancelled") {
            toast.error(`Order has been cancelled`);
          } else if (newStatus === "processing") {
            toast.info(`Your order is now being processed`);
          } else if (newStatus === "confirmed") {
            toast.success(`✓ Your order has been confirmed!`);
          } else {
            toast.info(`Order status updated to: ${getStatusLabel(newStatus)}`);
          }
        }

        // Check for tracking number added
        if (!prev.trackingNumber && updatedOrder.tracking?.trackingNumber) {
          hasChanges = true;
          toast.info(
            `Tracking number added: ${updatedOrder.tracking.trackingNumber}`
          );
        }

        // Check for estimated delivery update
        if (
          prev.estimatedDelivery !== updatedOrder.tracking?.estimatedDelivery &&
          updatedOrder.tracking?.estimatedDelivery
        ) {
          hasChanges = true;
          const date = new Date(
            updatedOrder.tracking.estimatedDelivery
          ).toLocaleDateString();
          toast.info(`Estimated delivery updated: ${date}`);
        }
      }

      // Update stored data
      previousStatusRef.current = {
        orderStatus: updatedOrder.orderStatus,
        trackingNumber: updatedOrder.tracking?.trackingNumber,
        estimatedDelivery: updatedOrder.tracking?.estimatedDelivery,
      };

      return hasChanges;
    },
    [toast]
  );

  // Sync function - returns the updated order
  const syncOrder = useCallback(async () => {
    if (!orderId || !token) {
      return null;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/${orderId}`, config);
      const updatedOrder = response.data.order;

      if (!updatedOrder) {
        return null;
      }

      // Check for changes and notify
      const hasChanges = checkForChangesAndNotify(updatedOrder);

      return { order: updatedOrder, hasChanges };
    } catch (error) {
      // Silently fail - don't show errors for background sync
      console.error("Order sync error:", error.message);
      return null;
    }
  }, [orderId, token, checkForChangesAndNotify]);

  // Return sync function and interval setup
  return { syncOrder, intervalRef };
}

/**
 * Custom hook to sync orders list in real-time
 * Runs every 5 seconds and updates the orders list on the Orders page
 * Shows toast notifications for status changes
 */
export function useOrdersListSync(toast, page = 1, limit = 10) {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const previousOrdersRef = useRef(new Map());
  const isFirstRun = useRef(true);

  // Get auth token and current orders
  const { token } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);

  // Status labels for notifications
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

  // Check for changes and show toasts
  const checkForChangesAndNotify = useCallback(
    (updatedOrders) => {
      if (!toast || isFirstRun.current) {
        // Store initial data without showing toasts
        updatedOrders.forEach((order) => {
          previousOrdersRef.current.set(order._id, {
            orderStatus: order.orderStatus,
            trackingNumber: order.tracking?.trackingNumber,
          });
        });
        isFirstRun.current = false;
        return;
      }

      updatedOrders.forEach((order) => {
        const prev = previousOrdersRef.current.get(order._id);

        if (prev) {
          // Check for status changes
          if (prev.orderStatus !== order.orderStatus) {
            const newStatus = order.orderStatus;
            const orderId = order._id.slice(-6).toUpperCase();

            if (newStatus === "delivered") {
              toast.success(`🎉 Order #${orderId} has been delivered!`);
            } else if (newStatus === "shipped") {
              toast.success(`📦 Order #${orderId} has been shipped!`);
            } else if (newStatus === "out_for_delivery") {
              toast.success(`🚚 Order #${orderId} is out for delivery!`);
            } else if (newStatus === "cancelled") {
              toast.error(`Order #${orderId} has been cancelled`);
            } else if (newStatus === "confirmed") {
              toast.success(`✓ Order #${orderId} has been confirmed!`);
            } else {
              toast.info(
                `Order #${orderId} status: ${getStatusLabel(newStatus)}`
              );
            }
          }

          // Check for tracking number added
          if (!prev.trackingNumber && order.tracking?.trackingNumber) {
            const orderId = order._id.slice(-6).toUpperCase();
            toast.info(`Tracking added for Order #${orderId}`);
          }
        }

        // Update stored data
        previousOrdersRef.current.set(order._id, {
          orderStatus: order.orderStatus,
          trackingNumber: order.tracking?.trackingNumber,
        });
      });
    },
    [toast]
  );

  // Sync function
  const syncOrders = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/my-orders?page=${page}&limit=${limit}`,
        config
      );

      const updatedOrders = response.data.orders || [];
      const pagination = response.data.pagination || {};

      if (updatedOrders.length === 0) {
        return;
      }

      // Check for changes and notify
      checkForChangesAndNotify(updatedOrders);

      // Check if there are actual changes before dispatching
      const hasChanges =
        !orders ||
        orders.length !== updatedOrders.length ||
        orders.some((order, index) => {
          const updated = updatedOrders[index];
          if (!updated) return true;
          return (
            order._id !== updated._id ||
            order.orderStatus !== updated.orderStatus ||
            order.tracking?.trackingNumber !== updated.tracking?.trackingNumber
          );
        });

      if (hasChanges) {
        dispatch(syncUserOrders({ orders: updatedOrders, pagination }));
      }
    } catch (error) {
      // Silently fail - don't show errors for background sync
      console.error("Orders list sync error:", error.message);
    }
  }, [token, page, limit, orders, dispatch, checkForChangesAndNotify]);

  // Set up interval
  useEffect(() => {
    // Run immediately on mount
    syncOrders();

    // Set up interval
    intervalRef.current = setInterval(syncOrders, SYNC_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [syncOrders]);

  // Return sync function for manual refresh if needed
  return { syncOrders };
}

export default useOrderSync;
