import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Minus,
  Edit,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Archive,
  Eye,
  Check,
  X,
} from "lucide-react";
import { useToast } from "../../components/Toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const AdminInventory = () => {
  const { user, token } = useSelector((state) => state.auth);
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Expanded categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Stock update modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockAmount, setStockAmount] = useState("");
  const [stockOperation, setStockOperation] = useState("add");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch products (all, including inactive for admin)
      const productsRes = await axios.get(`${API_URL}/products?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch categories
      const categoriesRes = await axios.get(
        `${API_URL}/products/categories/all`
      );

      // Fetch sales data
      const salesRes = await axios.get(`${API_URL}/orders/admin/sales-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (productsRes.data.success) {
        setProducts(productsRes.data.data);
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.categories || []);
      }

      if (salesRes.data.success) {
        setSalesData(salesRes.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch inventory data");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Stock filter
    if (stockFilter === "low") {
      filtered = filtered.filter((p) => p.inStock > 0 && p.inStock <= 10);
    } else if (stockFilter === "out") {
      filtered = filtered.filter((p) => p.inStock === 0);
    } else if (stockFilter === "in") {
      filtered = filtered.filter((p) => p.inStock > 10);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "stock":
          comparison = a.inStock - b.inStock;
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  // Group products by category
  const getProductsByCategory = () => {
    const filtered = getFilteredProducts();
    const grouped = {};

    filtered.forEach((product) => {
      const cat = product.category || "Uncategorized";
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(product);
    });

    return grouped;
  };

  // Update stock
  const handleUpdateStock = async () => {
    if (!editingProduct || !stockAmount) return;

    try {
      setIsUpdating(true);
      const response = await axios.patch(
        `${API_URL}/products/${editingProduct._id}/quantity`,
        {
          quantity: parseInt(stockAmount),
          operation: stockOperation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update local state
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id
              ? { ...p, inStock: response.data.data.inStock }
              : p
          )
        );
        toast.success("Stock updated successfully!");
        setEditingProduct(null);
        setStockAmount("");
        setStockOperation("add");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.inStock, 0);
  const lowStockCount = products.filter(
    (p) => p.inStock > 0 && p.inStock <= 10
  ).length;
  const outOfStockCount = products.filter((p) => p.inStock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.inStock, 0);

  const productsByCategory = getProductsByCategory();
  const categoryNames = Object.keys(productsByCategory).sort();

  if (user?.type !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage stock levels, track sales, and monitor inventory health
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalProducts}
              </p>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalStock.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <Archive className="w-5 h-5" />
            </div>
          </div>
        </div>
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Inventory Value
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{totalValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 text-white p-3 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div> */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {lowStockCount}
              </p>
            </div>
            <div className="bg-yellow-500 text-white p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {outOfStockCount}
              </p>
            </div>
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Stats */}
      {salesData.stats && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Real-Time Sales Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm">Today's Orders</p>
              <p className="text-3xl font-bold">
                {salesData.stats.todayOrders || 0}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Today's Revenue</p>
              <p className="text-3xl font-bold">
                ₹{(salesData.stats.todayRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">This Month Orders</p>
              <p className="text-3xl font-bold">
                {salesData.stats.monthOrders || 0}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">This Month Revenue</p>
              <p className="text-3xl font-bold">
                ₹{(salesData.stats.monthRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
          {salesData.topProducts && salesData.topProducts.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-sm font-medium text-blue-100 mb-3">
                Top Selling Products
              </h3>
              <div className="flex flex-wrap gap-3">
                {salesData.topProducts.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg px-3 py-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-blue-200 text-sm ml-2">
                      ({item.sold} sold)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Stock Levels</option>
            <option value="in">In Stock (&gt;10)</option>
            <option value="low">Low Stock (1-10)</option>
            <option value="out">Out of Stock</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === "asc" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory by Category */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : categoryNames.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found matching your criteria
        </div>
      ) : (
        <div className="space-y-4">
          {categoryNames.map((category) => {
            const categoryProducts = productsByCategory[category];
            const categoryStock = categoryProducts.reduce(
              (sum, p) => sum + p.inStock,
              0
            );
            const categoryValue = categoryProducts.reduce(
              (sum, p) => sum + p.price * p.inStock,
              0
            );
            const isExpanded = expandedCategories[category] !== false;

            return (
              <div
                key={category}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Package size={20} className="text-gray-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900">
                        {category}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {categoryProducts.length} products • {categoryStock}{" "}
                        units • ₹{categoryValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {categoryProducts.some((p) => p.inStock === 0) && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Out of Stock
                      </span>
                    )}
                    {categoryProducts.some(
                      (p) => p.inStock > 0 && p.inStock <= 10
                    ) && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        Low Stock
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </button>

                {/* Products Table */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SKU
                            </th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {categoryProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    src={
                                      product.image || product.images?.[0]?.url
                                    }
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                      {product.name}
                                    </div>
                                    {product.brand && (
                                      <div className="text-xs text-gray-500">
                                        {product.brand}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.sku || "-"}
                              </td> */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ₹{product.price.toLocaleString()}
                                </div>
                                {product.discount > 0 && (
                                  <div className="text-xs text-green-600">
                                    -{product.discount}%
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`text-sm font-bold ${
                                    product.inStock === 0
                                      ? "text-red-600"
                                      : product.inStock <= 10
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {product.inStock}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹
                                {(
                                  product.price * product.inStock
                                ).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {product.inStock === 0 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Out of Stock
                                  </span>
                                ) : product.inStock <= 10 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Low Stock
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    In Stock
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingProduct(product)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                    title="Update Stock"
                                  >
                                    <Plus size={16} />
                                  </button>
                                  <Link
                                    to={`/admin/products/edit/${product._id}`}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                                    title="Edit Product"
                                  >
                                    <Edit size={16} />
                                  </Link>
                                  <Link
                                    to={`/products/${product._id}`}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                                    title="View Product"
                                  >
                                    <Eye size={16} />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Update Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Update Stock
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Product:</p>
              <p className="font-medium">{editingProduct.name}</p>
              <p className="text-sm text-gray-500">
                Current Stock: {editingProduct.inStock} units
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStockOperation("add")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    stockOperation === "add"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Plus size={16} className="inline mr-1" />
                  Add
                </button>
                <button
                  onClick={() => setStockOperation("subtract")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    stockOperation === "subtract"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Minus size={16} className="inline mr-1" />
                  Remove
                </button>
                <button
                  onClick={() => setStockOperation("set")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    stockOperation === "set"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Set
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {stockOperation === "set" ? "New Stock Level" : "Quantity"}
              </label>
              <input
                type="number"
                min="0"
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
                placeholder="Enter quantity"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {stockAmount && (
                <p className="text-sm text-gray-500 mt-2">
                  New stock will be:{" "}
                  <span className="font-bold">
                    {stockOperation === "add"
                      ? editingProduct.inStock + parseInt(stockAmount || 0)
                      : stockOperation === "subtract"
                      ? Math.max(
                          0,
                          editingProduct.inStock - parseInt(stockAmount || 0)
                        )
                      : parseInt(stockAmount || 0)}
                  </span>{" "}
                  units
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateStock}
                disabled={isUpdating || !stockAmount}
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update Stock"}
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setStockAmount("");
                  setStockOperation("add");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
