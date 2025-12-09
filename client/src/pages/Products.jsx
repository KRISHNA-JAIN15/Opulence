import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "../store/productSlice";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../store/wishlistSlice";
import { addToCart } from "../store/cartSlice";
import { useToast } from "../components/Toast";
import {
  Search,
  Grid,
  List,
  Filter,
  Star,
  ShoppingCart,
  Eye,
  Heart,
} from "lucide-react";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();
  const { products, categories, isLoading, pagination, isError, message } =
    useSelector((state) => state.products);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);

  const searchQuery = searchParams.get("search");
  const categoryFromUrl = searchParams.get("category");

  // Initialize categories and handle URL category
  useEffect(() => {
    dispatch(getCategories());

    // Get wishlist if user is logged in
    if (token) {
      dispatch(getWishlist());
    }

    // Set initial category from URL if present
    if (categoryFromUrl) {
      console.log("Setting initial category from URL:", categoryFromUrl);
      setSelectedCategory(categoryFromUrl);
    }
  }, [dispatch, categoryFromUrl, token]);

  // Fetch products when filters change
  useEffect(() => {
    // Don't fetch if we're still waiting for URL category to be processed
    if (categoryFromUrl && !selectedCategory) {
      console.log("Skipping fetch - waiting for category to be set");
      return;
    }

    // Add a small delay to avoid rapid consecutive calls
    const timeoutId = setTimeout(() => {
      const filters = {};
      if (searchQuery) {
        filters.search = searchQuery;
        setSearchTerm(searchQuery);
      }
      if (selectedCategory) filters.category = selectedCategory;
      if (priceRange.min) filters.minPrice = priceRange.min;
      if (priceRange.max) filters.maxPrice = priceRange.max;
      if (sortBy) filters.sortBy = sortBy;
      if (sortOrder) filters.order = sortOrder;

      console.log("=== Products Fetch Effect ===");
      console.log("Filters being applied:", filters);
      console.log("Selected category state:", selectedCategory);

      dispatch(getProducts(filters));
    }, 100); // Small delay to debounce rapid changes

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    dispatch,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    sortOrder,
    categoryFromUrl,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search will be triggered by useEffect when searchTerm changes
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-wide mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Discover our curated collection of premium products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter size={20} />
                Filters
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="">All Categories</option>
                  {categories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="createdAt">Newest</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="md:col-span-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-gray-600">
                {searchQuery && (
                  <>
                    Search results for:{" "}
                    <span className="font-semibold">"{searchQuery}"</span>
                    {selectedCategory && (
                      <>
                        {" "}
                        in{" "}
                        <span className="font-semibold">
                          {selectedCategory}
                        </span>
                      </>
                    )}{" "}
                    •{" "}
                  </>
                )}
                {selectedCategory && !searchQuery && (
                  <>
                    Showing{" "}
                    <span className="font-semibold">{selectedCategory}</span>{" "}
                    products •{" "}
                  </>
                )}
                <span className="font-semibold">{pagination?.total || 0}</span>{" "}
                products found
              </p>
              {(selectedCategory ||
                searchQuery ||
                priceRange.min ||
                priceRange.max) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-black underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedCategory
                  ? `No ${selectedCategory} Products Found`
                  : "No Products Found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory
                  ? categories.some(
                      (cat) =>
                        cat.toLowerCase() === selectedCategory.toLowerCase()
                    )
                    ? `We don't have any products in the ${selectedCategory} category at the moment.`
                    : `The category "${selectedCategory}" doesn't exist. Available categories: ${categories.join(
                        ", "
                      )}.`
                  : searchQuery
                  ? `No products match your search for "${searchQuery}".`
                  : "No products match your current filters."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                  >
                    View All Categories
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-black hover:text-black transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
                formatPrice={formatPrice}
                wishlistItems={wishlistItems}
                token={token}
                dispatch={dispatch}
                toast={toast}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  viewMode,
  formatPrice,
  wishlistItems,
  token,
  dispatch,
  toast,
}) => {
  const isInWishlist = wishlistItems?.some((item) => item._id === product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product._id));
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-4 hover:shadow-md transition relative">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            className={`transition ${
              isInWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        {/* Product Image */}
        <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden">
          <img
            src={product.image || "/api/placeholder/400/400"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-base text-gray-900 hover:text-black transition">
              {product.name}
            </h3>
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
              {product.category}
            </span>
            {product.inStock > 0 ? (
              <span className="text-green-600 text-xs font-medium">
                In Stock
              </span>
            ) : (
              <span className="text-red-600 text-xs font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                {product.discount > 0 ? (
                  <>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(
                        product.price * (1 - product.discount / 100)
                      )}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">
                  {product.rating || "4.5"} (
                  {product.reviewCount || Math.floor(Math.random() * 100)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/products/${product._id}`}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-black hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              >
                <Eye size={16} />
                View Details
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === 0}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={20}
          className={`transition ${
            isInWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Product Image */}
      <Link
        to={`/products/${product._id}`}
        className="block aspect-square overflow-hidden"
      >
        <img
          src={product.image || "/api/placeholder/400/400"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-black transition hover:text-black cursor-pointer">
              {product.name}
            </h3>
          </Link>
          {product.discount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
            {product.category}
          </span>
          {product.inStock > 0 ? (
            <span className="text-green-600 text-xs font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 text-xs font-medium">
              Out of Stock
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {product.rating || "4.5"} (
              {product.reviewCount || Math.floor(Math.random() * 100)})
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-black hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          >
            <Eye size={16} />
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
