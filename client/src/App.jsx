import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import { ToastProvider, useToast } from "./components/Toast";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminUsers from "./pages/admin/Users";
import AdminInventory from "./pages/admin/Inventory";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import usePageLoading from "./hooks/usePageLoading";
import usePriceSync from "./hooks/usePriceSync";
import { initializeCartTotals } from "./store/cartSlice";
import { getWishlist } from "./store/wishlistSlice";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoading = usePageLoading(300);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const toast = useToast();

  // Background price sync - updates prices, stock, discounts every 3 seconds
  usePriceSync(toast);

  // Initialize cart totals on app start
  useEffect(() => {
    dispatch(initializeCartTotals());
  }, [dispatch]);

  // Load wishlist if user is logged in
  useEffect(() => {
    if (token) {
      dispatch(getWishlist());
    }
  }, [dispatch, token]);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {isLoading && <PageLoader />}
      {!isAdminRoute && <Header />}
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderTracking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminLayout>
                <ErrorBoundary>
                  <EditProduct />
                </ErrorBoundary>
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <AdminLayout>
                <AdminInventory />
              </AdminLayout>
            }
          />

          {/* Add more routes as needed */}
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </Router>
    </Provider>
  );
}

export default App;
