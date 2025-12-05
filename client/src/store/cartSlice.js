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
        // Check if adding quantity exceeds stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= product.inStock) {
          existingItem.quantity = newQuantity;
        } else {
          existingItem.quantity = product.inStock; // Set to max available
        }
      } else {
        // If item doesn't exist, add new item with validated quantity
        const validQuantity = Math.min(quantity, product.inStock);
        state.cartItems.push({
          ...product,
          quantity: validQuantity,
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
        // Validate quantity against stock
        const validQuantity = Math.min(quantity, existingItem.inStock);
        existingItem.quantity = validQuantity;
      } else if (existingItem && quantity <= 0) {
        // Remove item if quantity is 0 or less
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== productId
        );
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

    // Increment quantity by 1
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === productId
      );

      if (existingItem && existingItem.quantity < existingItem.inStock) {
        existingItem.quantity += 1;

        // Calculate new totals
        const totals = calculateCartTotals(state.cartItems);
        state.cartTotal = totals.cartTotal;
        state.cartQuantity = totals.cartQuantity;

        // Save to localStorage
        saveCartToLocalStorage(state.cartItems);
      }
    },

    // Decrement quantity by 1
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === productId
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          // Remove item if quantity becomes 0
          state.cartItems = state.cartItems.filter(
            (item) => item._id !== productId
          );
        }

        // Calculate new totals
        const totals = calculateCartTotals(state.cartItems);
        state.cartTotal = totals.cartTotal;
        state.cartQuantity = totals.cartQuantity;

        // Save to localStorage
        saveCartToLocalStorage(state.cartItems);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  initializeCartTotals,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
