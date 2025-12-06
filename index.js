const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const profileRoutes = require("./routes/profile");
const wishlistRoutes = require("./routes/wishlist");

dotenv.config();

connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"], // Allow requests from your React app and API
  credentials: true, // Allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Trust proxy for getting real IP addresses
app.set("trust proxy", true);

const port = process.env.PORT || 4000;

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Opulence API Server is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`🚀 Opulence server listening at http://localhost:${port}`);
  console.log(
    `📧 Email service configured: ${process.env.EMAIL_USER ? "Yes" : "No"}`
  );
  console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
});
