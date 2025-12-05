import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
} from "lucide-react";
import { getProduct, getRelatedProducts } from "../store/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, relatedProducts, isLoading, isError } = useSelector(
    (state) => state.products
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      title: "Absolutely love this product!",
      comment:
        "The quality exceeded my expectations. Fast shipping and excellent customer service. Highly recommend!",
      date: "2024-11-15",
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      user: "Mike R.",
      rating: 4,
      title: "Great value for money",
      comment:
        "Very satisfied with the purchase. Good build quality and exactly as described. Minor packaging issue but product was perfect.",
      date: "2024-11-10",
      helpful: 8,
      verified: true,
    },
    {
      id: 3,
      user: "Emily K.",
      rating: 5,
      title: "Perfect!",
      comment:
        "This is my second purchase from Opulence. Consistently high quality products. Will definitely buy again.",
      date: "2024-11-05",
      helpful: 15,
      verified: true,
    },
  ];

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
      // Also fetch related products
      dispatch(getRelatedProducts(id));
    }
  }, [dispatch, id]);

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < (currentProduct?.inStock || 0)) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} of product ${id} to cart`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Submit review logic here
    console.log("Review submitted:", newReview);
    setNewReview({ rating: 5, title: "", comment: "" });
  };

  const calculateAverageRating = () => {
    if (mockReviews.length === 0) return 0;
    const total = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / mockReviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockReviews.forEach((review) => {
      distribution[review.rating]++;
    });
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
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
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
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
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
                        star <= Math.floor(calculateAverageRating())
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {calculateAverageRating()} ({mockReviews.length} reviews)
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
                  <div className="font-semibold text-sm">Easy Returns</div>
                  <div className="text-xs text-gray-600">30 Day Policy</div>
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
                <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

                {/* Reviews Summary */}
                <div className="bg-gray-50 p-6 rounded-xl mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {calculateAverageRating()}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={`${
                              star <= Math.floor(calculateAverageRating())
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {mockReviews.length} reviews
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = getRatingDistribution()[rating];
                          const percentage =
                            mockReviews.length > 0
                              ? (count / mockReviews.length) * 100
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
                          setNewReview({ ...newReview, title: e.target.value })
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
                      className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
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
                                {review.user}
                              </span>
                              {review.verified && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                  Verified Purchase
                                </span>
                              )}
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
                                {new Date(review.date).toLocaleDateString()}
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
                        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition">
                          <ThumbsUp size={16} />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition">
                          <MessageCircle size={16} />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
