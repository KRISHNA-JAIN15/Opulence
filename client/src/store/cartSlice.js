import { createSlice } from "@reduxjs/toolkit";

// Get cart from localStorage
const getCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error getting cart from localStorage:", error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState = {
  cartItems: getCartFromLocalStorage(),
  cartTotal: 0,
  cartQuantity: 0,
};

// Calculate cart totals
const calculateCartTotals = (cartItems) => {
  const cartTotal = cartItems.reduce((total, item) => {
    const price =
      item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return total + price * item.quantity;
  }, 0);

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return { cartTotal: parseFloat(cartTotal.toFixed(2)), cartQuantity };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        // If item exists, update quantity
        existingItem.quantity += quantity;
      } else {
        // If item doesn't exist, add new item
        state.cartItems.push({
          ...product,
          quantity: quantity,
        });
      }

      // Calculate new totals
      const totals = calculateCartTotals(state.cartItems);
      state.cartTotal = totals.cartTotal;
      state.cartQuantity = totals.cartQuantity;

      // Save to localStorage
      saveCartToLocalStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== productId
      );

      // Calculate new totals
      const totals = calculateCartTotals(state.cartItems);
      state.cartTotal = totals.cartTotal;
      state.cartQuantity = totals.cartQuantity;

      // Save to localStorage
      saveCartToLocalStorage(state.cartItems);
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === productId
      );

      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
      }

      // Calculate new totals
      const totals = calculateCartTotals(state.cartItems);
      state.cartTotal = totals.cartTotal;
      state.cartQuantity = totals.cartQuantity;

      // Save to localStorage
      saveCartToLocalStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotal = 0;
      state.cartQuantity = 0;

      // Clear localStorage
      localStorage.removeItem("cart");
    },

    // Initialize cart totals (useful for app initialization)
    initializeCartTotals: (state) => {
      const totals = calculateCartTotals(state.cartItems);
      state.cartTotal = totals.cartTotal;
      state.cartQuantity = totals.cartQuantity;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  initializeCartTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
