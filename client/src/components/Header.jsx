import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2.5 text-sm font-semibold tracking-wide">
        Free shipping over €69
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-3xl md:text-4xl font-black text-black tracking-tight hover:opacity-80 transition">
                OPULENCE
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <Link
                to="/products"
                className="text-black text-sm font-bold hover:text-gray-600 transition uppercase tracking-wider"
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="text-black text-sm font-bold hover:text-gray-600 transition uppercase tracking-wider"
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="text-black text-sm font-bold hover:text-gray-600 transition uppercase tracking-wider"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-black text-sm font-bold hover:text-gray-600 transition uppercase tracking-wider"
              >
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Search */}
              <button
                onClick={() =>
                  document.getElementById("search-modal").showModal()
                }
                className="p-2.5 hover:bg-gray-100 rounded-full transition"
                aria-label="Search"
              >
                <Search size={22} strokeWidth={2} />
              </button>

              {/* User/Auth */}
              {user ? (
                <div className="relative group">
                  <button className="p-2.5 hover:bg-gray-100 rounded-full transition flex items-center space-x-2">
                    <User size={22} strokeWidth={2} />
                    <span className="hidden lg:inline text-sm font-semibold">
                      {user.name}
                    </span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-5 py-3 text-sm font-medium hover:bg-gray-50 border-b border-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-5 py-3 text-sm font-medium hover:bg-gray-50 border-b border-gray-100"
                    >
                      My Orders
                    </Link>
                    {user.type === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-5 py-3 text-sm font-medium hover:bg-gray-50 border-b border-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-3 text-sm font-medium hover:bg-red-50 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2.5 hover:bg-gray-100 rounded-full transition"
                  aria-label="Login"
                >
                  <User size={22} strokeWidth={2} />
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2.5 hover:bg-gray-100 rounded-full transition relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} strokeWidth={2} />
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 space-y-1 border-t border-gray-200 pt-4">
              <Link
                to="/products"
                className="block py-3 text-black font-bold hover:text-gray-600 hover:bg-gray-50 px-4 rounded transition uppercase tracking-wider text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="block py-3 text-black font-bold hover:text-gray-600 hover:bg-gray-50 px-4 rounded transition uppercase tracking-wider text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="block py-3 text-black font-bold hover:text-gray-600 hover:bg-gray-50 px-4 rounded transition uppercase tracking-wider text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block py-3 text-black font-bold hover:text-gray-600 hover:bg-gray-50 px-4 rounded transition uppercase tracking-wider text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <dialog id="search-modal" className="modal backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
          <form onSubmit={handleSearch}>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded focus:outline-none focus:border-black transition"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => document.getElementById("search-modal").close()}
                className="px-6 py-3 bg-gray-200 text-black font-bold rounded hover:bg-gray-300 transition uppercase text-sm"
              >
                Close
              </button>
              <button type="submit" className="px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800 transition uppercase text-sm">
                Search
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Header;
