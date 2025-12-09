import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../store/wishlistSlice";
import { addToCart } from "../store/cartSlice";
import { useToast } from "../components/Toast";
import { Heart, ShoppingCart, Trash2, XCircle } from "lucide-react";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { wishlistItems, isLoading } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(getWishlist());
  }, [dispatch, token, navigate]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist");
  };

  const handleClearWishlist = () => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      dispatch(clearWishlist());
      toast.success("Wishlist cleared");
    }
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        inStock: product.inStock,
        discount: product.discount,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (discount && discount > 0) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Save your favorite items here so you can easily find them later.
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"}
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group"
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveFromWishlist(product._id)}
              className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
              title="Remove from wishlist"
            >
              <XCircle className="w-5 h-5 text-red-600" />
            </button>

            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                {product.discount}% OFF
              </div>
            )}

            {/* Product Image */}
            <Link to={`/products/${product._id}`} className="block">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
              <Link to={`/products/${product._id}`}>
                <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-gray-500 mb-3 capitalize">
                {product.category}
              </p>

              {/* Price */}
              <div className="mb-4">
                {product.discount > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      $
                      {calculateDiscountedPrice(
                        product.price,
                        product.discount
                      ).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-3">
                {product.inStock ? (
                  <span className="text-sm text-green-600 font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  product.inStock
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
