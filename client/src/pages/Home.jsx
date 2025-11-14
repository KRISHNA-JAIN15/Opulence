import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Award, Headphones } from "lucide-react";

const Home = () => {
  // Hardcoded products
  const latestProducts = [
    {
      id: 1,
      name: "CORE ACTION SPORTS BRIGHT PINK SKATE HELMET",
      price: "37.90",
      image: "https://images.unsplash.com/photo-1562620669-b8b78c09e93e?w=500&h=500&fit=crop"
    },
    {
      id: 2,
      name: "NITRO T1 - MEN'S SNOWBOARD 2025/26",
      price: "579.90",
      image: "https://images.unsplash.com/photo-1519864550538-43d52a24f94c?w=500&h=500&fit=crop"
    },
    {
      id: 3,
      name: "NITRO TEAM - MEN'S SNOWBOARD 2025/26",
      price: "579.90",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop"
    },
    {
      id: 4,
      name: "NITRO OPTISYM - MEN'S SNOWBOARD 2025/26",
      price: "559.90",
      image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&h=500&fit=crop"
    },
    {
      id: 5,
      name: "SANTA CRUZ - PRO MEEK SCRATCHED SLASHER FEELBASE PRODECK SKATE",
      price: "82.50",
      originalPrice: "86.90",
      discount: "-10%",
      image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=500&h=500&fit=crop"
    },
    {
      id: 6,
      name: "SANTA CRUZ - PRO ASTA COSMIC EYES TWIN PRO DECK SKATE",
      price: "82.50",
      originalPrice: "86.90",
      discount: "-10%",
      image: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=500&h=500&fit=crop"
    },
    {
      id: 7,
      name: "SANTA CRUZ - VX WOOTEN PART ONE VX DECK SKATE",
      price: "118.90",
      image: "https://images.unsplash.com/photo-1603821871019-68c0dec44a5f?w=500&h=500&fit=crop"
    },
    {
      id: 8,
      name: "SANTA CRUZ - PRO ROSKOPP DISSECT DECK SKATE",
      price: "73.90",
      image: "https://images.unsplash.com/photo-1621544402532-8fc5c51e0623?w=500&h=500&fit=crop"
    }
  ];

  const offerProducts = [
    {
      id: 1,
      name: "SANTA CRUZ - PRO MEEK SCRATCHED SLASHER FEELBASE PRODECK SKATE",
      price: "82.50",
      originalPrice: "86.90",
      discount: "-10%",
      image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=500&h=500&fit=crop"
    },
    {
      id: 2,
      name: "SANTA CRUZ - PRO ASTA COSMIC EYES TWIN PRO DECK SKATE",
      price: "82.50",
      originalPrice: "86.90",
      discount: "-10%",
      image: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=500&h=500&fit=crop"
    },
    {
      id: 3,
      name: "MONS ROYALE MCCLOUD BEANIE - UNISEX BLACK HAT",
      price: "24.90",
      originalPrice: "35.90",
      discount: "-30%",
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&h=500&fit=crop"
    },
    {
      id: 4,
      name: "RADIO LEGION 29\" WHEELIE BIKE",
      price: "989.00",
      originalPrice: "999.00",
      discount: "-0%",
      image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=1920&h=600&fit=crop')"
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

      {/* Latest Arrivals */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-heading">LATEST ARRIVALS</h2>
        <div className="text-center mb-12">
          <Link to="/products" className="inline-block bg-black text-white px-8 py-3 font-bold uppercase hover:bg-gray-800 transition">
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
        <h2 className="section-heading">OFFERS</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/products" className="inline-block bg-black text-white px-8 py-3 font-bold uppercase hover:bg-gray-800 transition">
            View all
          </Link>
        </div>
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
            Receive exclusive offers, news, and be the first to know about the latest arrivals
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
  return (
    <Link to={`/products/${product.id}`} className="product-card group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.discount && (
          <span className="discount-badge">{product.discount}</span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-sm mb-3 line-clamp-2 uppercase tracking-wide leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="price-original">€{product.originalPrice}</span>
          )}
          <span className="price-current">€{product.price}</span>
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
        {title} <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
      </div>
    </Link>
  );
};

export default Home;
