import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, Package, TrendingUp, Star, Users } from "lucide-react";
import { getProducts } from "../store/productSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const stats = calculateCategoryStats(products);
      setCategoryStats(stats);
    }
  }, [products]);

  const calculateCategoryStats = (products) => {
    const categoryMap = {};

    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          productCount: 0,
          totalRating: 0,
          ratedProducts: 0,
          minPrice: Infinity,
          maxPrice: 0,
          products: [],
          featuredImage: null,
          totalReviews: 0,
          averageDiscount: 0,
          discountedProducts: 0,
        };
      }

      const cat = categoryMap[category];
      cat.productCount++;
      cat.products.push(product);

      // Set featured image (first product with image)
      if (!cat.featuredImage && product.image) {
        cat.featuredImage = product.image;
      }

      // Calculate price range
      const price = parseFloat(product.price);
      if (price < cat.minPrice) cat.minPrice = price;
      if (price > cat.maxPrice) cat.maxPrice = price;

      // Calculate ratings
      if (product.rating) {
        cat.totalRating += product.rating;
        cat.ratedProducts++;
      }

      // Calculate reviews
      if (product.reviewCount) {
        cat.totalReviews += product.reviewCount;
      }

      // Calculate discounts
      if (product.discount && product.discount > 0) {
        cat.averageDiscount += product.discount;
        cat.discountedProducts++;
      }
    });

    // Calculate averages and format data
    return Object.values(categoryMap)
      .map((cat) => ({
        ...cat,
        averageRating:
          cat.ratedProducts > 0
            ? (cat.totalRating / cat.ratedProducts).toFixed(1)
            : 4.0,
        priceRange:
          cat.minPrice === Infinity
            ? "N/A"
            : `€${cat.minPrice} - €${cat.maxPrice}`,
        averageDiscount:
          cat.discountedProducts > 0
            ? (cat.averageDiscount / cat.discountedProducts).toFixed(0)
            : 0,
      }))
      .sort((a, b) => b.productCount - a.productCount);
  };

  const getCategoryImage = (categoryName) => {
    const images = {
      Electronics:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop",
      Fashion:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
      Accessories:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      "Home & Garden":
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      Sports:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      Books:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      Beauty:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop",
    };

    return (
      images[categoryName] ||
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop')",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">SHOP BY CATEGORY</h1>
          <p className="hero-subtitle">DISCOVER OUR COLLECTIONS</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-heading">ALL CATEGORIES</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : categoryStats.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-500">
              Categories will appear here once products are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryStats.map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                image={
                  category.featuredImage || getCategoryImage(category.name)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Category Card Component - Matching Collection Card Style
const CategoryCard = ({ category, image }) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="collection-card group"
    >
      <img src={image} alt={category.name} />
      <div className="collection-overlay"></div>

      {/* Product Count Badge */}
      <div
        className="discount-badge"
        style={{ top: "12px", left: "12px", background: "#000" }}
      >
        {category.productCount} items
      </div>

      {/* Discount Info Badge - Only show if there are discounted products */}
      {category.discountedProducts > 0 && (
        <div
          className="discount-badge"
          style={{
            top: "12px",
            right: "12px",
            left: "auto",
            fontSize: "0.75rem",
          }}
        >
          {category.discountedProducts} ON SALE
        </div>
      )}

      <div className="collection-title flex items-center gap-3">
        {category.name.toUpperCase()}{" "}
        <ArrowRight
          className="group-hover:translate-x-2 transition-transform"
          size={28}
        />
      </div>
    </Link>
  );
};

export default Categories;
