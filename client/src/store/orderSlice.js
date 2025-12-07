import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Get Razorpay Key
export const getRazorpayKey = createAsyncThunk(
  "order/getRazorpayKey",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(`${API_URL}/orders/payment/key`, config);
      return response.data.key;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get payment key"
      );
    }
  }
);

// Create Razorpay Order
export const createRazorpayOrder = createAsyncThunk(
  "order/createRazorpayOrder",
  async (amount, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/orders/payment/create`,
        { amount },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create payment order"
      );
    }
  }
);

// Verify Payment and Create Order
export const verifyPaymentAndCreateOrder = createAsyncThunk(
  "order/verifyPaymentAndCreateOrder",
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/orders/payment/verify`,
        paymentData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  }
);

// Get User Orders
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async ({ page = 1, limit = 10 } = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(
        `${API_URL}/orders/my-orders?page=${page}&limit=${limit}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get orders"
      );
    }
  }
);

// Get Order by ID
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(`${API_URL}/orders/${orderId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get order"
      );
    }
  }
);

// Get Order by Order Number
export const getOrderByNumber = createAsyncThunk(
  "order/getOrderByNumber",
  async (orderNumber, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(
        `${API_URL}/orders/number/${orderNumber}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get order"
      );
    }
  }
);

// Cancel Order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async ({ orderId, reason }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/orders/${orderId}/cancel`,
        { reason },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

// Admin: Get All Orders
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (
    { page = 1, limit = 20, status = "" } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const statusQuery = status ? `&status=${status}` : "";
      const response = await axios.get(
        `${API_URL}/orders/admin/all?page=${page}&limit=${limit}${statusQuery}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get orders"
      );
    }
  }
);

// Admin: Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async (
    { orderId, status, note, trackingNumber, carrier, estimatedDelivery },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/orders/admin/${orderId}/status`,
        { status, note, trackingNumber, carrier, estimatedDelivery },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

const initialState = {
  orders: [],
  adminOrders: [],
  currentOrder: null,
  razorpayKey: null,
  razorpayOrderId: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  adminPagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  isPaymentLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.isLoading = false;
      state.isPaymentLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Razorpay Key
      .addCase(getRazorpayKey.pending, (state) => {
        state.isPaymentLoading = true;
      })
      .addCase(getRazorpayKey.fulfilled, (state, action) => {
        state.isPaymentLoading = false;
        state.razorpayKey = action.payload;
      })
      .addCase(getRazorpayKey.rejected, (state, action) => {
        state.isPaymentLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Razorpay Order
      .addCase(createRazorpayOrder.pending, (state) => {
        state.isPaymentLoading = true;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.isPaymentLoading = false;
        state.razorpayOrderId = action.payload.orderId;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.isPaymentLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Verify Payment and Create Order
      .addCase(verifyPaymentAndCreateOrder.pending, (state) => {
        state.isPaymentLoading = true;
      })
      .addCase(verifyPaymentAndCreateOrder.fulfilled, (state, action) => {
        state.isPaymentLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload.order;
        state.message = "Order placed successfully!";
      })
      .addCase(verifyPaymentAndCreateOrder.rejected, (state, action) => {
        state.isPaymentLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Order by Number
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload.order;
        // Update the order in the orders list
        const index = state.orders.findIndex(
          (o) => o._id === action.payload.order._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        state.message = "Order cancelled successfully";
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Admin: Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminOrders = action.payload.orders;
        state.adminPagination = action.payload.pagination;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Admin: Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the order in the admin orders list
        const index = state.adminOrders.findIndex(
          (o) => o._id === action.payload.order._id
        );
        if (index !== -1) {
          state.adminOrders[index] = action.payload.order;
        }
        state.message = "Order status updated successfully";
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetOrderState, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
