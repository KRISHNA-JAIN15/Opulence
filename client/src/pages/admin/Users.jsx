import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Users,
  Search,
  Mail,
  Calendar,
  ShoppingBag,
  Heart,
  Package,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  User,
  Filter,
  Eye,
} from "lucide-react";

const API_URL = "http://localhost:3000/api";

const AdminUsers = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Fetch user activity when a user is selected
  const fetchUserActivity = async (userId) => {
    try {
      setIsLoadingActivity(true);
      const response = await axios.get(`${API_URL}/users/${userId}/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUserActivity(response.data.activity);
      }
    } catch (err) {
      console.error("Failed to fetch user activity:", err);
      setUserActivity(null);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const handleSelectUser = (userData) => {
    setSelectedUser(userData);
    fetchUserActivity(userData._id);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setUserActivity(null);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" ||
      (filterType === "verified" && u.isVerified) ||
      (filterType === "unverified" && !u.isVerified) ||
      (filterType === "admin" && u.type === "admin") ||
      (filterType === "buyer" && u.type === "buyer");
    return matchesSearch && matchesType;
  });

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

  // User Detail View
  if (selectedUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Users</span>
        </button>

        {/* User Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={32} className="text-gray-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedUser.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail size={16} />
                  <span>{selectedUser.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedUser.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedUser.isVerified ? "Verified" : "Unverified"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedUser.type === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {selectedUser.type === "admin" ? "Admin" : "Buyer"}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>
                Member since{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {isLoadingActivity ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          </div>
        ) : userActivity ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {userActivity.stats.totalOrders}
                    </p>
                  </div>
                  <div className="bg-blue-500 text-white p-3 rounded-lg">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Spent
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{userActivity.stats.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-500 text-white p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Wishlist Items
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {userActivity.stats.wishlistCount}
                    </p>
                  </div>
                  <div className="bg-pink-500 text-white p-3 rounded-lg">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Avg. Order Value
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{userActivity.stats.avgOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-orange-500 text-white p-3 rounded-lg">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preferred Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Preferred Categories
                </h2>
                {userActivity.preferredCategories &&
                userActivity.preferredCategories.length > 0 ? (
                  <div className="space-y-3">
                    {userActivity.preferredCategories.map((cat, index) => (
                      <div
                        key={cat.category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                ? "bg-orange-400"
                                : "bg-gray-300"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">
                            {cat.category}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {cat.count} {cat.count === 1 ? "item" : "items"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No purchase history yet
                  </p>
                )}
              </div>

              {/* Wishlist */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Wishlist Items
                </h2>
                {userActivity.wishlist && userActivity.wishlist.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userActivity.wishlist.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image || item.images?.[0]?.url}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No wishlist items
                  </p>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Recent Orders
              </h2>
              {userActivity.recentOrders &&
              userActivity.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userActivity.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{order.pricing.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.orderStatus === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : order.orderStatus === "shipped" ||
                                    order.orderStatus === "out_for_delivery"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.orderStatus
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Failed to load user activity
          </div>
        )}
      </div>
    );
  }

  // Users List View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage all registered users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {users.length}
              </p>
            </div>
            <div className="bg-purple-500 text-white p-3 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {users.filter((u) => u.isVerified).length}
              </p>
            </div>
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unverified</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {users.filter((u) => !u.isVerified).length}
              </p>
            </div>
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {users.filter((u) => u.type === "admin").length}
              </p>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="admin">Admins</option>
              <option value="buyer">Buyers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No users found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userData) => (
                  <tr
                    key={userData._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectUser(userData)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userData.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {userData.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.type === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {userData.type === "admin" ? "Admin" : "Buyer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {userData.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userData.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectUser(userData);
                        }}
                        className="text-black hover:text-gray-700 flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
