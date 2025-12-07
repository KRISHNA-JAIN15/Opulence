import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import {
  Package,
  Plus,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Home,
  ShoppingCart,
  Tag,
  ChevronDown,
  Receipt,
} from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-blue-600 text-white text-center py-2.5 text-sm font-semibold tracking-wide">
        Admin Dashboard - Manage your store
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/admin" className="flex items-center">
              <div className="text-3xl md:text-4xl font-black text-blue-600 tracking-tight hover:opacity-80 transition">
                OPULENCE
              </div>
              <span className="ml-2 text-sm font-bold text-gray-600 bg-blue-100 px-2 py-1 rounded">
                ADMIN
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-gray-700 text-sm font-bold hover:text-blue-600 transition uppercase tracking-wider"
              >
                <BarChart3 size={18} />
                Dashboard
              </Link>
              <Link
                to="/admin/products/add"
                className="flex items-center gap-2 text-gray-700 text-sm font-bold hover:text-blue-600 transition uppercase tracking-wider"
              >
                <Plus size={18} />
                Add
              </Link>
              <Link
                to="/admin/inventory"
                className="flex items-center gap-2 text-gray-700 text-sm font-bold hover:text-blue-600 transition uppercase tracking-wider"
              >
                <Package size={18} />
                Inventory
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-2 text-gray-700 text-sm font-bold hover:text-blue-600 transition uppercase tracking-wider"
              >
                <Users size={18} />
                Users
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-2 text-gray-700 text-sm font-bold hover:text-blue-600 transition uppercase tracking-wider"
              >
                <ShoppingCart size={18} />
                Orders
              </Link>

              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="flex items-center gap-2 text-gray-700 text-sm font-bold hover:text-blue-600 transition uppercase tracking-wider"
                >
                  <Settings size={18} />
                  Settings
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      showSettingsDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showSettingsDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSettingsDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                      <Link
                        to="/admin/users"
                        onClick={() => setShowSettingsDropdown(false)}
                        state={{ openCouponModal: true }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-100"
                      >
                        <Tag size={18} className="text-purple-600" />
                        <span className="font-medium text-gray-700">
                          Coupons
                        </span>
                      </Link>
                      <Link
                        to="/admin/transactions"
                        onClick={() => setShowSettingsDropdown(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                      >
                        <Receipt size={18} className="text-green-600" />
                        <span className="font-medium text-gray-700">
                          Transactions
                        </span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Back to Store */}
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Back to Store</span>
              </Link>

              {/* User Info */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Administrator
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
