import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  Award,
  Headphones,
  ShoppingCart,
  Eye,
  Heart,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeaturedProducts,
  getDiscountedProducts,
} from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../store/wishlistSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, discountedProducts, isLoading } = useSelector(
    (state) => state.products
  );
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFeaturedProducts(8));
    dispatch(getDiscountedProducts(8));
    if (token) {
      dispatch(getWishlist());
    }
  }, [dispatch, token]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=1920&h=600&fit=crop')",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">OPULENCE</h1>
          <p className="hero-subtitle">BEYOND EXPECTATIONS</p>
          <Link to="/products" className="btn-primary inline-block">
            BUY NOW
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-heading">FEATURED PRODUCTS</h2>
        <div className="text-center mb-12">
          <Link
            to="/products"
            className="inline-block bg-black text-white px-8 py-3 font-bold uppercase hover:bg-gray-800 transition"
          >
            VIEW ALL
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No featured products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlistItems={wishlistItems}
                token={token}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard
              icon={<Truck size={56} strokeWidth={1.5} />}
              title="FREE SHIPPING"
              description="On orders over €69"
            />
            <FeatureCard
              icon={<Shield size={56} strokeWidth={1.5} />}
              title="SAFE PURCHASES"
              description="100% secure payment"
            />
            <FeatureCard
              icon={<Award size={56} strokeWidth={1.5} />}
              title="PRODUCT QUALITY"
              description="Premium quality guaranteed"
            />
            <FeatureCard
              icon={<Headphones size={56} strokeWidth={1.5} />}
              title="ASSISTANCE AND SUPPORT"
              description="24/7 customer service"
            />
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-heading">BEST DISCOUNTS</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : discountedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No discounted products available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {discountedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistItems={wishlistItems}
                  token={token}
                />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/products"
                className="inline-block bg-black text-white px-8 py-3 font-bold uppercase hover:bg-gray-800 transition"
              >
                View all
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Collections Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-heading">COLLECTIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CollectionCard
            title="ELECTRONICS"
            link="/products?category=Electronics"
            image="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop"
          />
          <CollectionCard
            title="FASHION"
            link="/products?category=Fashion"
            image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop"
          />
          <CollectionCard
            title="ACCESSORIES"
            link="/products?category=Accessories"
            image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop"
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="newsletter-title">JOIN OPULENCE</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Receive exclusive offers, news, and be the first to know about the
            latest arrivals
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="E-mail address"
              className="newsletter-input"
              required
            />
            <button
              type="submit"
              className="newsletter-button flex items-center justify-center gap-2"
            >
              SUBSCRIBE <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, wishlistItems, token }) => {
  const dispatch = useDispatch();

  const isInWishlist = wishlistItems?.some((item) => item._id === product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      alert("Please login to add items to wishlist");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  // Calculate discounted price and original price
  const hasDiscount = product.discount > 0;
  const originalPrice = hasDiscount ? product.price : null;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));

    // Simple success feedback
    const button = e.target.closest("button");
    const originalText = button.innerHTML;
    button.innerHTML = "<span>Added!</span>";
    button.style.backgroundColor = "#22c55e";

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.backgroundColor = "";
    }, 1500);
  };

  return (
    <div className="product-card group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition relative">
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

      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {hasDiscount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-sm mb-3 line-clamp-2 uppercase tracking-wide leading-snug min-h-10 hover:text-gray-700 transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-4">
          {hasDiscount && originalPrice && (
            <span className="price-original">€{originalPrice}</span>
          )}
          <span className="price-current">€{discountedPrice}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:border-black hover:text-black transition flex-1"
          >
            <Eye size={16} />
            <span>View</span>
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

// Collection Card Component
const CollectionCard = ({ title, link, image }) => {
  return (
    <Link to={link} className="collection-card group">
      <img src={image} alt={title} />
      <div className="collection-overlay"></div>
      <div className="collection-title flex items-center gap-3">
        {title}{" "}
        <ArrowRight
          className="group-hover:translate-x-2 transition-transform"
          size={28}
        />
      </div>
    </Link>
  );
};

export default Home;
