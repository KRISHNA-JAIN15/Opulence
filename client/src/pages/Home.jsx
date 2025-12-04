import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Award, Headphones } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeaturedProducts,
  getDiscountedProducts,
} from "../store/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, discountedProducts, isLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getFeaturedProducts(8));
    dispatch(getDiscountedProducts(8));
  }, [dispatch]);

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
              <ProductCard key={product._id} product={product} />
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
                <ProductCard key={product._id} product={product} />
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
const ProductCard = ({ product }) => {
  // Calculate discounted price and original price
  const hasDiscount = product.discount > 0;
  const originalPrice = hasDiscount ? product.price : null;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  return (
    <Link to={`/products/${product._id}`} className="product-card group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {hasDiscount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-sm mb-3 line-clamp-2 uppercase tracking-wide leading-snug min-h-10">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {hasDiscount && originalPrice && (
            <span className="price-original">€{originalPrice}</span>
          )}
          <span className="price-current">€{discountedPrice}</span>
        </div>
      </div>
    </Link>
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
