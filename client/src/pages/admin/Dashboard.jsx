import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, reset } from "../../store/productSlice";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, isLoading, pagination } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getProducts());
    return () => dispatch(reset());
  }, [dispatch]);

  // Mock statistics - you can replace with real data from backend
  const stats = [
    {
      title: "Total Products",
      value: pagination?.total || 0,
      icon: <Package className="w-8 h-8" />,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Total Orders",
      value: "1,234",
      icon: <ShoppingCart className="w-8 h-8" />,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Total Users",
      value: "567",
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-500",
      change: "+15%",
    },
    {
      title: "Revenue",
      value: "€45,678",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-orange-500",
      change: "+23%",
    },
  ];

  const filteredProducts =
    products?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your products, orders, and users from here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Products Management
              </h2>
              <Link
                to="/admin/products/add"
                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Add Product
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                />
              </div>
            </div>

            {/* Products Table */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {product.category}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">
                          €{product.price}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.inStock > 10
                                ? "bg-green-100 text-green-800"
                                : product.inStock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/products/${product._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Product"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Product"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this product?"
                                  )
                                ) {
                                  // Handle delete - you'll need to implement deleteProduct action
                                  console.log("Delete product:", product._id);
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found</p>
                <Link
                  to="/admin/products/add"
                  className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Add Your First Product
                </Link>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
