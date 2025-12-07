import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateCartItemsSilently } from "../store/cartSlice";
import { updateWishlistItemsSilently } from "../store/wishlistSlice";
import { updateProductsSilently } from "../store/productSlice";

const API_URL = "http://localhost:3000/api/products";

// Interval in milliseconds (3 seconds)
const SYNC_INTERVAL = 3000;

/**
 * Custom hook to sync product prices, stock, and discounts
 * Runs every 3 seconds and updates cart, wishlist, and current products
 * Shows toast notifications for price/discount changes
 */
export function usePriceSync(toast) {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const previousDataRef = useRef(new Map());
  const isFirstRun = useRef(true);

  // Get current state
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const currentProduct = useSelector((state) => state.products.currentProduct);
  const products = useSelector((state) => state.products.products);
  const featuredProducts = useSelector(
    (state) => state.products.featuredProducts
  );
  const discountedProducts = useSelector(
    (state) => state.products.discountedProducts
  );

  // Collect all product IDs that need to be synced
  const getProductIdsToSync = useCallback(() => {
    const ids = new Set();

    // Add cart items
    cartItems.forEach((item) => ids.add(item._id));

    // Add wishlist items
    wishlistItems.forEach((item) => {
      if (item.product?._id) {
        ids.add(item.product._id);
      } else if (item._id) {
        ids.add(item._id);
      }
    });

    // Add current product if viewing product detail
    if (currentProduct?._id) {
      ids.add(currentProduct._id);
    }

    // Add products from list (limit to visible ones to avoid heavy requests)
    products.slice(0, 20).forEach((product) => ids.add(product._id));

    // Add featured products (homepage)
    featuredProducts.forEach((product) => ids.add(product._id));

    // Add discounted products (homepage)
    discountedProducts.forEach((product) => ids.add(product._id));

    return Array.from(ids);
  }, [
    cartItems,
    wishlistItems,
    currentProduct,
    products,
    featuredProducts,
    discountedProducts,
  ]);

  // Get IDs of products in cart or wishlist (for toast notifications)
  const getImportantProductIds = useCallback(() => {
    const ids = new Set();

    // Add cart items
    cartItems.forEach((item) => ids.add(item._id));

    // Add wishlist items
    wishlistItems.forEach((item) => {
      if (item.product?._id) {
        ids.add(item.product._id);
      } else if (item._id) {
        ids.add(item._id);
      }
    });

    return ids;
  }, [cartItems, wishlistItems]);

  // Check for changes and show toasts (only for cart/wishlist items)
  const checkForChangesAndNotify = useCallback(
    (updatedProducts) => {
      if (!toast || isFirstRun.current) {
        // Store initial data without showing toasts
        updatedProducts.forEach((product) => {
          previousDataRef.current.set(product._id, {
            price: product.price,
            discount: product.discount,
            inStock: product.inStock,
          });
        });
        isFirstRun.current = false;
        return;
      }

      // Only show toasts for items in cart or wishlist
      const importantIds = getImportantProductIds();

      updatedProducts.forEach((product) => {
        const prev = previousDataRef.current.get(product._id);
        const isImportant = importantIds.has(product._id);

        if (prev && isImportant) {
          // Check for price changes
          if (prev.price !== product.price) {
            const direction =
              product.price > prev.price ? "increased" : "decreased";
            toast.price(
              `Price ${direction} for "${product.name.substring(0, 30)}${
                product.name.length > 30 ? "..." : ""
              }" - Now ₹${product.price}`
            );
          }

          // Check for discount changes
          if (prev.discount !== product.discount) {
            if (product.discount > prev.discount) {
              toast.success(
                `New discount on "${product.name.substring(0, 25)}${
                  product.name.length > 25 ? "..." : ""
                }" - ${product.discount}% off!`
              );
            } else if (
              product.discount < prev.discount &&
              product.discount === 0
            ) {
              toast.warning(
                `Discount ended for "${product.name.substring(0, 30)}${
                  product.name.length > 30 ? "..." : ""
                }"`
              );
            }
          }

          // Check for stock changes (only notify if went out of stock)
          if (prev.inStock > 0 && product.inStock === 0) {
            toast.warning(
              `"${product.name.substring(0, 30)}${
                product.name.length > 30 ? "..." : ""
              }" is now out of stock`
            );
          } else if (prev.inStock === 0 && product.inStock > 0) {
            toast.success(
              `"${product.name.substring(0, 30)}${
                product.name.length > 30 ? "..." : ""
              }" is back in stock!`
            );
          } else if (
            product.inStock <= 5 &&
            product.inStock > 0 &&
            prev.inStock > 5
          ) {
            toast.warning(
              `Only ${product.inStock} left of "${product.name.substring(
                0,
                25
              )}${product.name.length > 25 ? "..." : ""}"`
            );
          }
        }

        // Update stored data for all products (not just important ones)
        previousDataRef.current.set(product._id, {
          price: product.price,
          discount: product.discount,
          inStock: product.inStock,
        });
      });
    },
    [toast, getImportantProductIds]
  );

  // Refetch discounted and featured products to catch new discounts
  const refetchSpecialProducts = useCallback(async () => {
    try {
      const [discountedRes, featuredRes] = await Promise.all([
        axios.get(`${API_URL}/discounted?limit=8`),
        axios.get(`${API_URL}/featured?limit=8`),
      ]);

      const newDiscounted = discountedRes.data.data || [];
      const newFeatured = featuredRes.data.data || [];

      // Check if discounted products changed (different products or count)
      const currentDiscountedIds = discountedProducts
        .map((p) => p._id)
        .sort()
        .join(",");
      const newDiscountedIds = newDiscounted
        .map((p) => p._id)
        .sort()
        .join(",");

      if (currentDiscountedIds !== newDiscountedIds) {
        dispatch(updateProductsSilently({ discountedProducts: newDiscounted }));
      }

      // Check if featured products changed
      const currentFeaturedIds = featuredProducts
        .map((p) => p._id)
        .sort()
        .join(",");
      const newFeaturedIds = newFeatured
        .map((p) => p._id)
        .sort()
        .join(",");

      if (currentFeaturedIds !== newFeaturedIds) {
        dispatch(updateProductsSilently({ featuredProducts: newFeatured }));
      }
    } catch (error) {
      // Silently fail
      console.error("Refetch special products error:", error.message);
    }
  }, [dispatch, discountedProducts, featuredProducts]);

  // Sync function
  const syncPrices = useCallback(async () => {
    const productIds = getProductIdsToSync();

    // Skip if no products to sync
    if (productIds.length === 0) {
      // Still refetch special products even if no products to sync
      await refetchSpecialProducts();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/batch`, { productIds });
      const updatedProducts = response.data.products;

      if (!updatedProducts || updatedProducts.length === 0) {
        return;
      }

      // Check for changes and show notifications
      checkForChangesAndNotify(updatedProducts);

      // Create a map for quick lookup
      const productMap = new Map(updatedProducts.map((p) => [p._id, p]));

      // Update cart items silently (without loading states)
      if (cartItems.length > 0) {
        const updatedCartItems = cartItems.map((item) => {
          const updated = productMap.get(item._id);
          if (updated) {
            return {
              ...updated,
              quantity: Math.min(
                item.quantity,
                updated.inStock || item.quantity
              ),
            };
          }
          return item;
        });

        // Only dispatch if there are actual changes
        const hasCartChanges = cartItems.some((item, index) => {
          const updated = updatedCartItems[index];
          return (
            item.price !== updated.price ||
            item.discount !== updated.discount ||
            item.inStock !== updated.inStock ||
            item.quantity !== updated.quantity
          );
        });

        if (hasCartChanges) {
          dispatch(updateCartItemsSilently(updatedCartItems));
        }
      }

      // Update wishlist items silently
      if (wishlistItems.length > 0) {
        const updatedWishlistItems = wishlistItems.map((item) => {
          const productId = item.product?._id || item._id;
          const updated = productMap.get(productId);
          if (updated) {
            if (item.product) {
              return { ...item, product: updated };
            }
            return updated;
          }
          return item;
        });

        const hasWishlistChanges = wishlistItems.some((item, index) => {
          const oldProduct = item.product || item;
          const newItem = updatedWishlistItems[index];
          const newProduct = newItem.product || newItem;
          return (
            oldProduct.price !== newProduct.price ||
            oldProduct.discount !== newProduct.discount ||
            oldProduct.inStock !== newProduct.inStock
          );
        });

        if (hasWishlistChanges) {
          dispatch(updateWishlistItemsSilently(updatedWishlistItems));
        }
      }

      // Update current product and products list silently
      if (currentProduct && productMap.has(currentProduct._id)) {
        const updated = productMap.get(currentProduct._id);
        if (
          currentProduct.price !== updated.price ||
          currentProduct.discount !== updated.discount ||
          currentProduct.inStock !== updated.inStock
        ) {
          dispatch(updateProductsSilently({ currentProduct: updated }));
        }
      }

      // Update products list
      if (products.length > 0) {
        const updatedProductsList = products.map((p) => {
          const updated = productMap.get(p._id);
          return updated || p;
        });

        const hasProductsChanges = products.some((p, index) => {
          const updated = updatedProductsList[index];
          return (
            p.price !== updated.price ||
            p.discount !== updated.discount ||
            p.inStock !== updated.inStock
          );
        });

        if (hasProductsChanges) {
          dispatch(updateProductsSilently({ products: updatedProductsList }));
        }
      }

      // Update featured products (homepage)
      if (featuredProducts.length > 0) {
        const updatedFeaturedList = featuredProducts.map((p) => {
          const updated = productMap.get(p._id);
          return updated || p;
        });

        const hasFeaturedChanges = featuredProducts.some((p, index) => {
          const updated = updatedFeaturedList[index];
          return (
            p.price !== updated.price ||
            p.discount !== updated.discount ||
            p.inStock !== updated.inStock
          );
        });

        if (hasFeaturedChanges) {
          dispatch(
            updateProductsSilently({ featuredProducts: updatedFeaturedList })
          );
        }
      }

      // Update discounted products (homepage)
      if (discountedProducts.length > 0) {
        const updatedDiscountedList = discountedProducts.map((p) => {
          const updated = productMap.get(p._id);
          return updated || p;
        });

        const hasDiscountedChanges = discountedProducts.some((p, index) => {
          const updated = updatedDiscountedList[index];
          return (
            p.price !== updated.price ||
            p.discount !== updated.discount ||
            p.inStock !== updated.inStock
          );
        });

        if (hasDiscountedChanges) {
          dispatch(
            updateProductsSilently({
              discountedProducts: updatedDiscountedList,
            })
          );
        }
      }

      // Refetch discounted and featured products to catch newly added discounts
      await refetchSpecialProducts();
    } catch (error) {
      // Silently fail - don't show errors for background sync
      console.error("Price sync error:", error.message);
    }
  }, [
    getProductIdsToSync,
    checkForChangesAndNotify,
    dispatch,
    cartItems,
    wishlistItems,
    currentProduct,
    products,
    featuredProducts,
    discountedProducts,
    refetchSpecialProducts,
  ]);

  // Set up interval
  useEffect(() => {
    // Run immediately on mount
    syncPrices();

    // Set up interval
    intervalRef.current = setInterval(syncPrices, SYNC_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [syncPrices]);

  // Return sync function for manual refresh if needed
  return { syncPrices };
}

export default usePriceSync;
