import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user profile
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: getAuthHeaders(),
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Update personal information
export const updatePersonalInfo = createAsyncThunk(
  "profile/updatePersonalInfo",
  async (personalInfo, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/personal-info`,
        personalInfo,
        { headers: getAuthHeaders() }
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update personal information"
      );
    }
  }
);

// Add address
export const addAddress = createAsyncThunk(
  "profile/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/profile/addresses`,
        addressData,
        { headers: getAuthHeaders() }
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
  }
);

// Update address
export const updateAddress = createAsyncThunk(
  "profile/updateAddress",
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/addresses/${addressId}`,
        addressData,
        { headers: getAuthHeaders() }
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  "profile/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/profile/addresses/${addressId}`,
        { headers: getAuthHeaders() }
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

// Add payment method
export const addPaymentMethod = createAsyncThunk(
  "profile/addPaymentMethod",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/profile/payment-methods`,
        paymentData,
        { headers: getAuthHeaders() }
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add payment method"
      );
    }
  }
);

// Delete payment method
export const deletePaymentMethod = createAsyncThunk(
  "profile/deletePaymentMethod",
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/profile/payment-methods/${paymentMethodId}`,
        { headers: getAuthHeaders() }
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete payment method"
      );
    }
  }
);

// Update preferences
export const updatePreferences = createAsyncThunk(
  "profile/updatePreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/preferences`,
        preferences,
        { headers: getAuthHeaders() }
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update preferences"
      );
    }
  }
);

const initialState = {
  profile: null,
  isLoading: false,
  isError: false,
  message: "",
  isSuccess: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update personal info
      .addCase(updatePersonalInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = "Personal information updated successfully";
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add address
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = "Address added successfully";
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = "Address updated successfully";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = "Address deleted successfully";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add payment method
      .addCase(addPaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = "Payment method added successfully";
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete payment method
      .addCase(deletePaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = "Payment method deleted successfully";
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = "Preferences updated successfully";
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
