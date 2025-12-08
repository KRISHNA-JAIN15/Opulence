import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  ThumbsUp,
  MessageCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { getProduct, getRelatedProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../store/wishlistSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, relatedProducts, isLoading, isError } = useSelector(
    (state) => state.products
  );
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { token, user } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {},
  });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewEligibilityReason, setReviewEligibilityReason] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Fetch reviews for the product
  const fetchReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/reviews/product/${id}`);
      if (response.data.success) {
        setReviews(response.data.data);
        setReviewStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Check if user can review
  const checkCanReview = async () => {
    if (!token || !id) {
      setCanReview(false);
      setReviewEligibilityReason("Please login to write a review.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/reviews/can-review/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCanReview(response.data.canReview);
        setReviewEligibilityReason(response.data.reason || "");
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
      setCanReview(false);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
      // Also fetch related products
      dispatch(getRelatedProducts(id));
      // Fetch reviews
      fetchReviews();
    }
    // Get wishlist if user is logged in
    if (token) {
      dispatch(getWishlist());
    }
  }, [dispatch, id, token]);

  // Check review eligibility when user or product changes
  useEffect(() => {
    if (id) {
      checkCanReview();
    }
  }, [id, token]);

  const isInWishlist = wishlistItems?.some((item) => item._id === id);

  const handleWishlistToggle = () => {
    if (!token) {
      alert("Please login to add items to wishlist");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < (currentProduct?.inStock || 0)) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ product: currentProduct, quantity }));

      // Show success message
      console.log(`Added ${quantity} of ${currentProduct.name} to cart`);

      // You could add a toast notification here
      // For now, just reset quantity to 1 to indicate success
      setQuantity(1);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setReviewError("Please login to submit a review");
      return;
    }
    if (!canReview) {
      setReviewError(reviewEligibilityReason);
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const response = await axios.post(
        `${API_URL}/reviews`,
        {
          product: id,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setNewReview({ rating: 5, title: "", comment: "" });
        // Refresh reviews and eligibility
        fetchReviews();
        checkCanReview();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError(
        error.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!token) {
      alert("Please login to mark reviews as helpful");
      return;
    }
    try {
      await axios.patch(
        `${API_URL}/reviews/${reviewId}/helpful`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    Object.entries(reviewStats.ratingDistribution || {}).forEach(
      ([rating, count]) => {
        distribution[rating] = count;
      }
    );
    return distribution;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isError || !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const product = currentProduct;
  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  // Get all product images (main image + additional images from database)
  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [product.image];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black transition">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-black transition"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}%
                </div>
              )}
              <button
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
                title={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  className={
                    isInWishlist ? "text-red-500 fill-current" : "text-gray-600"
                  }
                />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= Math.floor(reviewStats.averageRating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {reviewStats.averageRating || 0} (
                  {reviewStats.totalReviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                €{discountedPrice}
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-500 line-through">
                  €{product.price}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm font-semibold ${
                  product.inStock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock > 0
                  ? `In Stock (${product.inStock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= product.inStock}
                    className="p-2 border border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inStock === 0}
                  className="flex-1 bg-black text-white py-4 px-8 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
                <button className="px-6 py-4 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck size={24} className="text-gray-600" />
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-600">Orders over €69</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield size={24} className="text-gray-600" />
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-600">100% Protected</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw size={24} className="text-gray-600" />
                <div>
                  <div className="font-semibold text-sm">
                    {product.returnDays > 0 ? "Easy Returns" : "No Returns"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {product.returnDays > 0
                      ? `${product.returnDays} Day Policy`
                      : "Non-returnable"}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award size={24} className="text-gray-600" />
                <div>
                  <div className="font-semibold text-sm">Quality Guarantee</div>
                  <div className="text-xs text-gray-600">Premium Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm uppercase tracking-wide transition ${
                    activeTab === tab
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
                {product.keyFeatures && (
                  <>
                    <h4 className="text-lg font-semibold mb-3">
                      Key Features:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      {product.keyFeatures
                        .split("\n")
                        .filter((feature) => feature.trim())
                        .map((feature, index) => (
                          <li key={index}>{feature.trim()}</li>
                        ))}
                    </ul>
                  </>
                )}
                {product.tags && (
                  <>
                    <h4 className="text-lg font-semibold mb-3 mt-6">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags
                        .split(",")
                        .filter((tag) => tag.trim())
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-lg mb-4">
                      General Information
                    </h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <dt className="font-medium text-gray-600">Category:</dt>
                        <dd className="text-gray-900">{product.category}</dd>
                      </div>
                      {product.brand && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <dt className="font-medium text-gray-600">Brand:</dt>
                          <dd className="text-gray-900">{product.brand}</dd>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <dt className="font-medium text-gray-600">SKU:</dt>
                        <dd className="text-gray-900">
                          {product.sku || product._id}
                        </dd>
                      </div>
                      {product.weight && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <dt className="font-medium text-gray-600">Weight:</dt>
                          <dd className="text-gray-900">{product.weight}</dd>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <dt className="font-medium text-gray-600">
                            Dimensions:
                          </dt>
                          <dd className="text-gray-900">
                            {product.dimensions}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-4">
                      Additional Details
                    </h4>
                    <dl className="space-y-3">
                      {product.material && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <dt className="font-medium text-gray-600">
                            Material:
                          </dt>
                          <dd className="text-gray-900">{product.material}</dd>
                        </div>
                      )}
                      {product.color && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <dt className="font-medium text-gray-600">Color:</dt>
                          <dd className="text-gray-900">{product.color}</dd>
                        </div>
                      )}
                      {product.warranty && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <dt className="font-medium text-gray-600">
                            Warranty:
                          </dt>
                          <dd className="text-gray-900">{product.warranty}</dd>
                        </div>
                      )}
                      {product.origin && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <dt className="font-medium text-gray-600">Origin:</dt>
                          <dd className="text-gray-900">{product.origin}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Customer Reviews</h3>
                  <button
                    onClick={fetchReviews}
                    disabled={reviewsLoading}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <RefreshCw
                      size={14}
                      className={reviewsLoading ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                </div>

                {/* Reviews Summary */}
                <div className="bg-gray-50 p-6 rounded-xl mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {reviewStats.averageRating || 0}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={`${
                              star <= Math.floor(reviewStats.averageRating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {reviewStats.totalReviews || 0} reviews
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = getRatingDistribution()[rating] || 0;
                          const percentage =
                            reviewStats.totalReviews > 0
                              ? (count / reviewStats.totalReviews) * 100
                              : 0;
                          return (
                            <div
                              key={rating}
                              className="flex items-center space-x-3"
                            >
                              <div className="flex items-center space-x-1">
                                <span className="text-sm font-medium">
                                  {rating}
                                </span>
                                <Star
                                  size={14}
                                  className="text-yellow-400 fill-current"
                                />
                              </div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Write Review Form */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h4 className="text-lg font-bold mb-4">Write a Review</h4>

                  {/* Show eligibility message */}
                  {!token && (
                    <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg mb-4">
                      <AlertCircle size={18} />
                      <span>
                        Please{" "}
                        <Link to="/login" className="underline font-medium">
                          login
                        </Link>{" "}
                        to write a review.
                      </span>
                    </div>
                  )}

                  {token && !canReview && reviewEligibilityReason && (
                    <div className="flex items-center gap-2 p-4 bg-amber-50 text-amber-700 rounded-lg mb-4">
                      <AlertCircle size={18} />
                      <span>{reviewEligibilityReason}</span>
                    </div>
                  )}

                  {reviewError && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg mb-4">
                      <AlertCircle size={18} />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {token && canReview && (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Rating
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setNewReview({ ...newReview, rating: star })
                              }
                              className="p-1"
                            >
                              <Star
                                size={24}
                                className={`transition ${
                                  star <= newReview.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 hover:text-yellow-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Review Title
                        </label>
                        <input
                          type="text"
                          value={newReview.title}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Give your review a title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Your Review
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              comment: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-vertical"
                          placeholder="Share your experience with this product..."
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submittingReview && (
                          <RefreshCw size={16} className="animate-spin" />
                        )}
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p className="text-lg font-medium">No reviews yet</p>
                    <p className="text-sm">
                      Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <User size={20} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">
                                  {review.user?.name || "Anonymous"}
                                </span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                  Verified Purchase
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={16}
                                      className={`${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h5 className="font-semibold text-gray-900 mb-2">
                          {review.title}
                        </h5>
                        <p className="text-gray-700 mb-4">{review.comment}</p>

                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleMarkHelpful(review._id)}
                            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition"
                          >
                            <ThumbsUp size={16} />
                            <span>Helpful ({review.helpful || 0})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {relatedProduct.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                        -{relatedProduct.discount}%
                      </div>
                    )}
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-gray-600 transition">
                      {relatedProduct.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {relatedProduct.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          €{relatedProduct.price}
                        </span>
                      )}
                      <span className="font-bold text-gray-900">
                        €
                        {relatedProduct.discount > 0
                          ? (
                              relatedProduct.price *
                              (1 - relatedProduct.discount / 100)
                            ).toFixed(2)
                          : relatedProduct.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
