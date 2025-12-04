import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
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
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchActive(false);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchActive) {
        setIsSearchActive(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchActive]);

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

            {/* Desktop Navigation / Search */}
            {isSearchActive ? (
              <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center w-full"
                >
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search
                        className="h-5 w-5 text-gray-400"
                        strokeWidth={2}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for products, brands, categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-900 placeholder-gray-500"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-3 px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 uppercase text-sm tracking-wide flex items-center gap-2"
                  >
                    <Search size={16} strokeWidth={2} />
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchActive(false);
                      setSearchQuery("");
                    }}
                    className="ml-2 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 uppercase text-sm tracking-wide"
                  >
                    <X size={16} />
                  </button>
                </form>
              </div>
            ) : (
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
            )}

            {/* Right Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Search */}
              <button
                onClick={() => {
                  setIsSearchActive(true);
                  setSearchQuery("");
                }}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 border border-transparent hover:border-gray-200 hover:shadow-sm"
                aria-label="Search"
                title="Search products"
              >
                <Search
                  size={20}
                  strokeWidth={2.5}
                  className="text-gray-700 hover:text-black transition-colors"
                />
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
                        className="block px-5 py-3 text-sm font-medium hover:bg-blue-50 text-blue-600 border-b border-gray-100"
                      >
                        🔧 Admin Dashboard
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
            <nav className="md:hidden pb-4 space-y-3 border-t border-gray-200 pt-4">
              {/* Mobile Search */}
              <div className="px-4">
                <form
                  onSubmit={(e) => {
                    handleSearch(e);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search
                        className="h-4 w-4 text-gray-400"
                        strokeWidth={2}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition text-sm uppercase tracking-wide"
                  >
                    Search
                  </button>
                </form>
              </div>

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
    </>
  );
};

export default Header;
