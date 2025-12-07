import { useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = "http://localhost:3000/api/orders";

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

export default useOrderSync;
