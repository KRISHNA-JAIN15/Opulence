import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Package,
  Eye,
  Wallet,
} from "lucide-react";
import {
  getProfile,
  updatePersonalInfo,
  addAddress,
  updateAddress,
  deleteAddress,
  updatePreferences,
} from "../store/profileSlice";
import { getUserOrders } from "../store/orderSlice";
import { getBalance } from "../store/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.profile
  );
  const { user, balance } = useSelector((state) => state.auth);
  const {
    orders,
    isLoading: ordersLoading,
    pagination,
  } = useSelector((state) => state.order);

  const [activeTab, setActiveTab] = useState("personal");
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [formData, setFormData] = useState({});

  // Load profile on component mount
  useEffect(() => {
    if (user) {
      dispatch(getProfile());
      dispatch(getBalance());
    }
  }, [dispatch, user]);

  // Load orders when switching to orders tab
  useEffect(() => {
    if (activeTab === "orders" && user) {
      dispatch(getUserOrders({ page: 1, limit: 10 }));
    }
  }, [activeTab, dispatch, user]);

  // Refresh balance when switching to wallet tab
  useEffect(() => {
    if (activeTab === "wallet" && user) {
      dispatch(getBalance());
    }
  }, [activeTab, dispatch, user]);

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Personal Information Form
  const PersonalInfoForm = () => {
    const [personalData, setPersonalData] = useState({
      firstName: profile?.personalInfo?.firstName || "",
      lastName: profile?.personalInfo?.lastName || "",
      phone: profile?.personalInfo?.phone || "",
      dateOfBirth: profile?.personalInfo?.dateOfBirth
        ? profile.personalInfo.dateOfBirth.split("T")[0]
        : "",
      gender: profile?.personalInfo?.gender || "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(updatePersonalInfo(personalData));
    };

    const handleChange = (e) => {
      setPersonalData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={personalData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={personalData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={personalData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={personalData.dateOfBirth}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={personalData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Personal Info"}
        </button>
      </form>
    );
  };

  // Address Form Component
  const AddressForm = ({ address = null, onCancel }) => {
    const [addressData, setAddressData] = useState({
      type: address?.type || "home",
      firstName: address?.firstName || "",
      lastName: address?.lastName || "",
      company: address?.company || "",
      address: address?.address || "",
      apartment: address?.apartment || "",
      city: address?.city || "",
      state: address?.state || "",
      zipCode: address?.zipCode || "",
      country: address?.country || "United States",
      isDefault: address?.isDefault || false,
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (address) {
        dispatch(updateAddress({ addressId: address._id, addressData }));
        setEditingAddress(null);
      } else {
        dispatch(addAddress(addressData));
        setShowAddAddress(false);
      }
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setAddressData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Type
            </label>
            <select
              name="type"
              value={addressData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={addressData.isDefault}
                onChange={handleChange}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">
                Default Address
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={addressData.firstName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={addressData.lastName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company (Optional)
            </label>
            <input
              type="text"
              name="company"
              value={addressData.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={addressData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartment/Suite
            </label>
            <input
              type="text"
              name="apartment"
              value={addressData.apartment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              name="zipCode"
              value={addressData.zipCode}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Saving..."
              : address
              ? "Update Address"
              : "Add Address"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary text-sm py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {isSuccess && message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {message}
          </div>
        )}
        {isError && message && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                {[
                  { id: "personal", label: "Personal Info", icon: User },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                  { id: "wallet", label: "Wallet", icon: Wallet },
                  { id: "orders", label: "Order History", icon: Package },
                  { id: "preferences", label: "Preferences", icon: Settings },
                ].map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm font-medium transition-colors ${
                        activeTab === id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === "personal" && "Personal Information"}
                  {activeTab === "addresses" && "Delivery Addresses"}
                  {activeTab === "wallet" && "Wallet Balance"}
                  {activeTab === "orders" && "Order History"}
                  {activeTab === "preferences" && "Account Preferences"}
                </h2>
              </div>

              <div className="px-6 py-6">
                {isLoading && !profile ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <>
                    {/* Personal Information Tab */}
                    {activeTab === "personal" && (
                      <div>
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Mail size={20} className="text-gray-500" />
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-gray-500">
                                Email Address
                              </p>
                            </div>
                          </div>
                        </div>
                        <PersonalInfoForm />
                      </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === "addresses" && (
                      <div>
                        {!showAddAddress && (
                          <div className="mb-6">
                            <button
                              onClick={() => setShowAddAddress(true)}
                              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors w-full"
                            >
                              <Plus size={20} />
                              Add New Address
                            </button>
                          </div>
                        )}

                        {showAddAddress && (
                          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-medium mb-4">
                              Add New Address
                            </h3>
                            <AddressForm
                              onCancel={() => setShowAddAddress(false)}
                            />
                          </div>
                        )}

                        <div className="space-y-4">
                          {profile?.addresses?.map((address) => (
                            <div
                              key={address._id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              {editingAddress === address._id ? (
                                <AddressForm
                                  address={address}
                                  onCancel={() => setEditingAddress(null)}
                                />
                              ) : (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                        {address.type}
                                      </span>
                                      {address.isDefault && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-medium">
                                      {address.firstName} {address.lastName}
                                    </p>
                                    {address.company && (
                                      <p className="text-sm text-gray-600">
                                        {address.company}
                                      </p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                      {address.address}
                                      {address.apartment &&
                                        `, ${address.apartment}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {address.city}, {address.state}{" "}
                                      {address.zipCode}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {address.country}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        setEditingAddress(address._id)
                                      }
                                      className="p-2 text-gray-400 hover:text-gray-600"
                                    >
                                      <Edit3 size={16} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        dispatch(deleteAddress(address._id))
                                      }
                                      className="p-2 text-gray-400 hover:text-red-600"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wallet Tab */}
                    {activeTab === "wallet" && (
                      <div>
                        <div className="text-center py-8">
                          {/* Balance Card */}
                          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white mb-8 max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-3 mb-4">
                              <Wallet size={32} />
                              <span className="text-lg font-medium">
                                Wallet Balance
                              </span>
                            </div>
                            <div className="text-4xl font-bold">
                              ₹{(balance || 0).toFixed(2)}
                            </div>
                            <p className="text-gray-300 mt-2 text-sm">
                              Available for purchases
                            </p>
                          </div>

                          {/* Info Section */}
                          <div className="bg-gray-50 rounded-lg p-6 max-w-lg mx-auto text-left">
                            <h3 className="font-semibold text-gray-900 mb-4">
                              About Your Wallet
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                              <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>
                                  When you cancel an order, the refund amount is
                                  automatically added to your wallet balance.
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>
                                  You can use your wallet balance for future
                                  purchases on our platform.
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>
                                  Wallet balance never expires and is always
                                  available for use.
                                </span>
                              </li>
                            </ul>
                          </div>

                          {/* Note */}
                          <p className="text-xs text-gray-500 mt-6">
                            Note: Orders can only be cancelled until they are
                            shipped. Once shipped, cancellation is not possible.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order History Tab */}
                    {activeTab === "orders" && (
                      <div>
                        {ordersLoading ? (
                          <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                          </div>
                        ) : orders && orders.length > 0 ? (
                          <div className="space-y-4">
                            {orders.map((order) => (
                              <div
                                key={order._id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <p className="font-medium text-gray-900">
                                        Order #{order.orderNumber}
                                      </p>
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          order.orderStatus === "delivered"
                                            ? "bg-green-100 text-green-800"
                                            : order.orderStatus === "cancelled"
                                            ? "bg-red-100 text-red-800"
                                            : order.orderStatus === "shipped" ||
                                              order.orderStatus ===
                                                "out_for_delivery"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {order.orderStatus
                                          .replace(/_/g, " ")
                                          .replace(/\b\w/g, (l) =>
                                            l.toUpperCase()
                                          )}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                      <span>
                                        {new Date(
                                          order.createdAt
                                        ).toLocaleDateString("en-IN", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                      <span>•</span>
                                      <span>{order.items.length} items</span>
                                      <span>•</span>
                                      <span className="font-medium text-gray-900">
                                        ₹{order.pricing.total.toFixed(2)}
                                      </span>
                                    </div>
                                    {/* Order Items Preview */}
                                    <div className="flex items-center gap-2 mt-3">
                                      {order.items
                                        .slice(0, 3)
                                        .map((item, idx) => (
                                          <img
                                            key={idx}
                                            src={
                                              item.image ||
                                              "/placeholder-product.jpg"
                                            }
                                            alt={item.name}
                                            className="w-10 h-10 object-cover rounded border border-gray-200"
                                          />
                                        ))}
                                      {order.items.length > 3 && (
                                        <span className="text-sm text-gray-500">
                                          +{order.items.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        navigate(`/orders/${order._id}`)
                                      }
                                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                      <Eye size={16} />
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                              <div className="flex justify-center gap-2 mt-6">
                                {Array.from(
                                  { length: pagination.pages },
                                  (_, i) => i + 1
                                ).map((page) => (
                                  <button
                                    key={page}
                                    onClick={() =>
                                      dispatch(
                                        getUserOrders({ page, limit: 10 })
                                      )
                                    }
                                    className={`px-3 py-1 rounded ${
                                      pagination.page === page
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Package
                              size={48}
                              className="mx-auto text-gray-400 mb-4"
                            />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No Orders Yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                              You haven't placed any orders yet. Start shopping
                              to see your order history here.
                            </p>
                            <button
                              onClick={() => navigate("/products")}
                              className="btn-primary inline-block"
                            >
                              Start Shopping
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === "preferences" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-4">
                            Notification Preferences
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                key: "emailNotifications",
                                label: "Email Notifications",
                              },
                              {
                                key: "smsNotifications",
                                label: "SMS Notifications",
                              },
                              {
                                key: "marketingEmails",
                                label: "Marketing Emails",
                              },
                            ].map(({ key, label }) => (
                              <label key={key} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={profile?.preferences?.[key] || false}
                                  onChange={(e) =>
                                    dispatch(
                                      updatePreferences({
                                        [key]: e.target.checked,
                                      })
                                    )
                                  }
                                  className="rounded border-gray-300 text-black focus:ring-black"
                                />
                                <span className="ml-3 text-sm text-gray-700">
                                  {label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-4">
                            Display Preferences
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Currency
                              </label>
                              <select
                                value={profile?.preferences?.currency || "USD"}
                                onChange={(e) =>
                                  dispatch(
                                    updatePreferences({
                                      currency: e.target.value,
                                    })
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                              >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Language
                              </label>
                              <select
                                value={profile?.preferences?.language || "en"}
                                onChange={(e) =>
                                  dispatch(
                                    updatePreferences({
                                      language: e.target.value,
                                    })
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                              >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
