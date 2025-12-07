import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  balance: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  verificationEmail: "",
};

// Signup user
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      if (response.data.success) {
        return {
          ...response.data,
          email: userData.email,
        };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      // If the error is about email verification, store the email for verification
      if (message.includes("verify your email")) {
        return thunkAPI.rejectWithValue({
          message,
          isEmailVerificationRequired: true,
          email: userData.email,
        });
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/verify-email`,
        verificationData
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Resend verification code
export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/resend-verification`, {
        email,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user balance
export const getBalance = createAsyncThunk(
  "auth/getBalance",
  async (_, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(`${API_URL}/balance`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setVerificationEmail: (state, action) => {
      state.verificationEmail = action.payload;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.verificationEmail = action.payload.email;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        // Handle email verification requirement
        if (action.payload?.isEmailVerificationRequired) {
          state.message = action.payload.message;
          state.verificationEmail = action.payload.email;
        } else {
          state.message = action.payload;
        }
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.balance = 0;
      })
      // Get Balance
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
      });
  },
});

export const { reset, setVerificationEmail, updateBalance } = authSlice.actions;
export default authSlice.reducer;
