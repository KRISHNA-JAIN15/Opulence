const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Import models
const User = require("../models/user");
const Product = require("../models/product");
const Transaction = require("../models/transactions");

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB Connected for seeding...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Users data - 10 users (2 admins, 8 regular verified users)
const usersData = [
  // Admin users
  {
    name: "Admin John",
    email: "admin.john@opulence.com",
    password: "Admin@123",
    type: "admin",
    isVerified: true,
    balance: 50000,
  },
  {
    name: "Admin Sarah",
    email: "admin.sarah@opulence.com",
    password: "Admin@123",
    type: "admin",
    isVerified: true,
    balance: 50000,
  },
  // Regular verified users
  {
    name: "Michael Chen",
    email: "michael.chen@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 15000,
  },
  {
    name: "Emily Davis",
    email: "emily.davis@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 12000,
  },
  {
    name: "Robert Wilson",
    email: "robert.wilson@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 8500,
  },
  {
    name: "Jessica Martinez",
    email: "jessica.martinez@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 20000,
  },
  {
    name: "David Brown",
    email: "david.brown@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 5000,
  },
  {
    name: "Amanda Johnson",
    email: "amanda.johnson@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 18000,
  },
  {
    name: "Christopher Lee",
    email: "christopher.lee@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 9500,
  },
  {
    name: "Sophia Garcia",
    email: "sophia.garcia@gmail.com",
    password: "User@123",
    type: "buyer",
    isVerified: true,
    balance: 25000,
  },
];

// Products data - 10 products across different categories with proper images
const productsData = [
  // Electronics
  {
    name: "Apple iPhone 15 Pro Max",
    description:
      "The latest flagship smartphone from Apple featuring A17 Pro chip, 48MP camera system, titanium design, and all-day battery life. Experience the future of mobile technology with Dynamic Island and ProMotion display.",
    price: 134900,
    costPrice: 95000,
    returnDays: 15,
    inStock: 25,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        publicId: "iphone15_main",
      },
    ],
    cloudinaryPublicId: "iphone15_main",
    isActive: true,
    discount: 5,
    featured: true,
    brand: "Apple",
    sku: "APPL-IP15PM-256",
    color: "Natural Titanium",
    material: "Titanium",
    warranty: "1 Year",
    origin: "USA",
    tags: "smartphone, apple, iphone, flagship, pro",
    keyFeatures:
      "A17 Pro Chip, 48MP Camera, Titanium Design, USB-C, Dynamic Island",
  },
  // Fashion
  {
    name: "Premium Leather Jacket",
    description:
      "Handcrafted genuine leather jacket with a classic biker style. Features premium quality lamb leather, satin lining, and durable YKK zippers. Perfect for any casual or semi-formal occasion.",
    price: 12999,
    costPrice: 7500,
    returnDays: 30,
    inStock: 40,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        publicId: "leather_jacket_main",
      },
    ],
    cloudinaryPublicId: "leather_jacket_main",
    isActive: true,
    discount: 10,
    featured: true,
    brand: "Urban Edge",
    sku: "UE-LJ-BLK-M",
    color: "Black",
    material: "Genuine Lamb Leather",
    warranty: "6 Months",
    origin: "Italy",
    tags: "jacket, leather, fashion, biker, premium",
    keyFeatures: "Genuine Leather, Satin Lining, YKK Zippers, Classic Fit",
  },
  // Home & Kitchen
  {
    name: "Smart Air Fryer Pro 6L",
    description:
      "Advanced digital air fryer with 6L capacity, 8 preset cooking programs, and WiFi connectivity. Cook healthier meals with 95% less oil. Features touch screen display and dishwasher-safe basket.",
    price: 8499,
    costPrice: 4800,
    returnDays: 15,
    inStock: 60,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1648503249889-f0e589f01a82?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1648503249889-f0e589f01a82?w=800",
        publicId: "airfryer_main",
      },
    ],
    cloudinaryPublicId: "airfryer_main",
    isActive: true,
    discount: 15,
    featured: false,
    brand: "KitchenMaster",
    sku: "KM-AF6L-PRO",
    color: "Black",
    material: "Stainless Steel",
    warranty: "2 Years",
    origin: "Germany",
    tags: "air fryer, kitchen, cooking, smart, healthy",
    keyFeatures:
      "6L Capacity, WiFi Enabled, 8 Presets, Touch Screen, Dishwasher Safe",
  },
  // Beauty
  {
    name: "Luxury Skincare Gift Set",
    description:
      "Complete premium skincare collection including vitamin C serum, hyaluronic acid moisturizer, retinol night cream, and gentle cleanser. Dermatologically tested for all skin types.",
    price: 4999,
    costPrice: 2200,
    returnDays: 7,
    inStock: 80,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
        publicId: "skincare_set_main",
      },
    ],
    cloudinaryPublicId: "skincare_set_main",
    isActive: true,
    discount: 20,
    featured: true,
    brand: "GlowEssence",
    sku: "GE-SKN-GIFT-01",
    color: "Rose Gold Packaging",
    material: "Natural Ingredients",
    warranty: "N/A",
    origin: "France",
    tags: "skincare, beauty, gift set, vitamin c, moisturizer",
    keyFeatures:
      "4-Piece Set, Vitamin C, Hyaluronic Acid, Retinol, Dermatologically Tested",
  },
  // Sports
  {
    name: "Professional Running Shoes",
    description:
      "High-performance running shoes with advanced cushioning technology, breathable mesh upper, and durable rubber outsole. Designed for marathon runners and daily joggers alike.",
    price: 7999,
    costPrice: 4200,
    returnDays: 30,
    inStock: 100,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        publicId: "running_shoes_main",
      },
    ],
    cloudinaryPublicId: "running_shoes_main",
    isActive: true,
    discount: 0,
    featured: true,
    brand: "SpeedRun",
    sku: "SR-RUN-RED-42",
    color: "Red/Black",
    material: "Mesh & Rubber",
    warranty: "1 Year",
    origin: "USA",
    tags: "shoes, running, sports, athletic, marathon",
    keyFeatures:
      "Advanced Cushioning, Breathable Mesh, Durable Outsole, Lightweight",
  },
  // Books
  {
    name: "The Art of Programming - Complete Edition",
    description:
      "Comprehensive guide to modern software development covering algorithms, data structures, system design, and best practices. Written by industry experts with 50+ years combined experience.",
    price: 1299,
    costPrice: 450,
    returnDays: 7,
    inStock: 200,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
        publicId: "programming_book_main",
      },
    ],
    cloudinaryPublicId: "programming_book_main",
    isActive: true,
    discount: 5,
    featured: false,
    brand: "TechPress",
    sku: "TP-AOP-CE-2024",
    color: "N/A",
    material: "Paper",
    weight: "1.2 kg",
    dimensions: "24 x 18 x 4 cm",
    warranty: "N/A",
    origin: "India",
    tags: "book, programming, software, algorithms, coding",
    keyFeatures:
      "800+ Pages, Code Examples, Interview Prep, System Design, Best Practices",
  },
  // Jewelry
  {
    name: "Diamond Pendant Necklace",
    description:
      "Elegant 18K white gold pendant featuring a 0.5 carat solitaire diamond with VS clarity. Comes with adjustable chain and luxury gift box. Perfect for special occasions.",
    price: 45999,
    costPrice: 32000,
    returnDays: 15,
    inStock: 15,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
        publicId: "diamond_pendant_main",
      },
    ],
    cloudinaryPublicId: "diamond_pendant_main",
    isActive: true,
    discount: 0,
    featured: true,
    brand: "Opulence Jewels",
    sku: "OJ-DP-18K-05",
    color: "White Gold",
    material: "18K White Gold & Diamond",
    weight: "4.5 grams",
    warranty: "Lifetime",
    origin: "Belgium",
    tags: "jewelry, diamond, pendant, necklace, luxury",
    keyFeatures:
      "0.5 Carat Diamond, 18K White Gold, VS Clarity, Adjustable Chain, Certified",
  },
  // Furniture
  {
    name: "Ergonomic Office Chair Pro",
    description:
      "Premium ergonomic office chair with 4D adjustable armrests, lumbar support, breathable mesh back, and memory foam seat. Designed for all-day comfort and productivity.",
    price: 24999,
    costPrice: 14000,
    returnDays: 30,
    inStock: 30,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800",
        publicId: "office_chair_main",
      },
    ],
    cloudinaryPublicId: "office_chair_main",
    isActive: true,
    discount: 10,
    featured: false,
    brand: "ErgoComfort",
    sku: "EC-OC-PRO-BLK",
    color: "Black",
    material: "Mesh & Aluminum",
    dimensions: "70 x 70 x 120 cm",
    weight: "18 kg",
    warranty: "5 Years",
    origin: "Sweden",
    tags: "chair, office, ergonomic, furniture, comfort",
    keyFeatures:
      "4D Armrests, Lumbar Support, Mesh Back, Memory Foam, 360° Rotation",
  },
  // Watches
  {
    name: "Classic Automatic Watch",
    description:
      "Swiss-made automatic mechanical watch with sapphire crystal, exhibition caseback, and genuine leather strap. Water resistant to 100m. A timeless piece for the modern gentleman.",
    price: 35999,
    costPrice: 22000,
    returnDays: 15,
    inStock: 20,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        publicId: "automatic_watch_main",
      },
    ],
    cloudinaryPublicId: "automatic_watch_main",
    isActive: true,
    discount: 5,
    featured: true,
    brand: "ChronoMaster",
    sku: "CM-AW-SS-42",
    color: "Silver/Brown",
    material: "Stainless Steel & Leather",
    dimensions: "42mm case",
    weight: "85 grams",
    warranty: "3 Years",
    origin: "Switzerland",
    tags: "watch, automatic, swiss, luxury, timepiece",
    keyFeatures:
      "Swiss Movement, Sapphire Crystal, 100m Water Resistant, Exhibition Back",
  },
  // Gaming
  {
    name: "Pro Gaming Headset 7.1",
    description:
      "Professional-grade gaming headset with 7.1 surround sound, noise-cancelling microphone, RGB lighting, and memory foam ear cushions. Compatible with PC, PS5, Xbox, and Nintendo Switch.",
    price: 6999,
    costPrice: 3500,
    returnDays: 15,
    inStock: 75,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
        publicId: "gaming_headset_main",
      },
    ],
    cloudinaryPublicId: "gaming_headset_main",
    isActive: true,
    discount: 15,
    featured: false,
    brand: "GameAudio",
    sku: "GA-HS71-PRO",
    color: "Black/RGB",
    material: "Plastic & Memory Foam",
    weight: "320 grams",
    warranty: "2 Years",
    origin: "Japan",
    tags: "gaming, headset, audio, 7.1, rgb",
    keyFeatures:
      "7.1 Surround Sound, Noise-Cancelling Mic, RGB, Memory Foam, Multi-Platform",
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("\n🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Transaction.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create users
    console.log("\n👤 Creating users...");
    const createdUsers = await User.create(usersData);
    console.log(`✅ ${createdUsers.length} users created`);

    // Get admin user for product creation reference
    const adminUser = createdUsers.find((u) => u.type === "admin");

    // Create products and their inventory transactions
    console.log("\n📦 Creating products and inventory transactions...");
    let totalInventoryValue = 0;

    for (const productData of productsData) {
      // Add createdBy reference
      productData.createdBy = adminUser._id;
      productData.updatedBy = adminUser._id;

      // Create product
      const product = await Product.create(productData);
      console.log(`  ✅ Created: ${product.name}`);

      // Calculate inventory value (cost price * quantity)
      const inventoryValue = product.costPrice * product.inStock;
      totalInventoryValue += inventoryValue;

      // Create outflow transaction for inventory purchase
      await Transaction.create({
        type: "inventory_add",
        product: product._id,
        user: adminUser._id,
        amount: inventoryValue,
        costAmount: inventoryValue,
        profit: 0,
        margin: 0,
        description: `Inventory purchase: ${product.name} (${product.inStock} units @ ₹${product.costPrice}/unit)`,
        quantity: product.inStock,
        sellingPrice: product.price,
        flowType: "outflow",
        status: "completed",
        metadata: {
          productName: product.name,
          category: product.category,
          sku: product.sku,
          unitCost: product.costPrice,
          totalUnits: product.inStock,
        },
      });
      console.log(
        `  💰 Outflow transaction created: ₹${inventoryValue.toLocaleString()}`
      );
    }

    console.log(
      `\n📊 Total Inventory Investment: ₹${totalInventoryValue.toLocaleString()}`
    );

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🌱 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📋 Summary:");
    console.log(`   👤 Users created: ${createdUsers.length}`);
    console.log(`      - Admins: 2`);
    console.log(`      - Regular users: 8`);
    console.log(`   📦 Products created: ${productsData.length}`);
    console.log(
      `   💰 Inventory transactions: ${productsData.length} (outflow)`
    );
    console.log(
      `   💵 Total inventory value: ₹${totalInventoryValue.toLocaleString()}`
    );
    console.log("\n🔐 Login Credentials:");
    console.log("   Admin 1: admin.john@opulence.com / Admin@123");
    console.log("   Admin 2: admin.sarah@opulence.com / Admin@123");
    console.log("   User: michael.chen@gmail.com / User@123");
    console.log("   (All users have password: User@123)");
    console.log("\n" + "=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();
