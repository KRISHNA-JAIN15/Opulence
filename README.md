# 🛍️ Opulence - Premium E-Commerce Platform

<div align="center">

![Opulence](https://img.shields.io/badge/Opulence-E--Commerce-gold?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A full-stack luxury e-commerce platform with modern design and comprehensive features**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Reference](#-api-reference) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🛒 Customer Features

#### **Shopping Experience**
- 🏠 **Homepage** with featured products, discounted items, and promotional banners
- 🔍 **Advanced Product Search** with filters (category, price range, brand)
- 📦 **Product Catalog** with pagination, sorting, and grid/list views
- 🏷️ **Category Browsing** for organized shopping
- 📱 **Responsive Design** optimized for all devices

#### **Product Details**
- 🖼️ **Multiple Product Images** with gallery view
- ⭐ **Product Reviews & Ratings** from verified buyers
- 📊 **Stock Availability** indicator
- 💰 **Discount Badges** with original and sale prices
- 🔄 **Return Policy** information display
- 📐 **Product Specifications** (brand, SKU, weight, dimensions, material, color)

#### **Cart & Checkout**
- 🛒 **Shopping Cart** with real-time price updates
- ➕ **Quantity Management** with stock validation
- 🎫 **Coupon Code System** for discounts
- 💳 **Razorpay Payment Integration** (secure online payments)
- 💰 **Wallet Balance** for quick checkout
- 🧾 **Order Summary** with tax and shipping calculations

#### **User Account**
- 👤 **User Registration** with email verification (6-digit OTP)
- 🔐 **Secure Login** with JWT authentication
- 🔑 **Password Reset** via email
- 📋 **User Profile** management
- 💼 **Digital Wallet** with balance management
- ❤️ **Wishlist** to save favorite products
- 📦 **Order History** with detailed tracking

#### **Order Management**
- 📍 **Real-time Order Tracking** with status updates
- 📧 **Order Confirmation Emails**
- 🔄 **Order Cancellation** (for pending orders)
- ↩️ **Return & Refund Requests**
- 📜 **Detailed Order History**

---

### 👨‍💼 Admin Features

#### **Dashboard**
- 📊 **Analytics Overview** (total products, orders, users, revenue)
- 📈 **Revenue Tracking** and statistics
- 🔔 **Quick Actions** for common tasks

#### **Product Management**
- ➕ **Add New Products** with multiple images
- ✏️ **Edit Product Details** (name, description, price, stock, etc.)
- 🗑️ **Delete Products** with Cloudinary image cleanup
- 🏷️ **Category Management**
- ⭐ **Featured Products** toggle
- 💯 **Discount Management**
- 📦 **Inventory Management** with stock alerts

#### **Order Management**
- 📋 **View All Orders** with filters
- 🔄 **Update Order Status** (confirmed → processing → shipped → delivered)
- ❌ **Cancel Orders** with refund processing
- 📧 **Order Status Email Notifications**
- 📊 **Order Statistics**

#### **User Management**
- 👥 **View All Users** with search
- 🔒 **Admin Role Assignment**
- 📧 **User Email Verification Status**
- 📊 **User Activity Tracking**

#### **Coupon Management**
- 🎫 **Create Discount Coupons** (percentage or fixed amount)
- ⏰ **Set Validity Period** (start and end dates)
- 🎯 **Minimum Order Requirements**
- 🔢 **Usage Limits** per coupon
- ✅ **Activate/Deactivate Coupons**
- 📧 **Send Promotional Emails** to all users

#### **Transaction Management**
- 💸 **View All Transactions** (sales, returns, refunds)
- 📊 **Revenue Analytics** with profit calculations
- 📅 **Date-based Filtering**
- 📉 **Inflow/Outflow Tracking**

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Redux Toolkit | State Management |
| React Router v7 | Navigation |
| Tailwind CSS v4 | Styling |
| React Hook Form | Form Handling |
| Axios | HTTP Client |
| Lucide React | Icons |
| Vite | Build Tool |

### **Backend**
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express v5 | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Razorpay | Payment Gateway |
| Cloudinary | Image Storage |
| Nodemailer | Email Service |
| Multer | File Uploads |

---

## 📁 Project Structure

```
opulence/
├── 📂 client/                  # React Frontend
│   ├── 📂 public/              # Static assets
│   └── 📂 src/
│       ├── 📂 assets/          # Images, fonts
│       ├── 📂 components/      # Reusable components
│       │   ├── AdminHeader.jsx
│       │   ├── AdminLayout.jsx
│       │   ├── ErrorBoundary.jsx
│       │   ├── Footer.jsx
│       │   ├── Header.jsx
│       │   ├── PageLoader.jsx
│       │   ├── ScrollToTop.jsx
│       │   └── Toast.jsx
│       ├── 📂 hooks/           # Custom React hooks
│       │   ├── useOrderSync.js
│       │   ├── usePageLoading.js
│       │   └── usePriceSync.js
│       ├── 📂 pages/           # Page components
│       │   ├── 📂 admin/       # Admin pages
│       │   ├── Home.jsx
│       │   ├── Products.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   └── ...
│       ├── 📂 store/           # Redux store
│       │   ├── store.js
│       │   ├── authSlice.js
│       │   ├── cartSlice.js
│       │   ├── productSlice.js
│       │   └── ...
│       └── 📂 utils/           # Utility functions
│
├── 📂 controllers/             # Route handlers
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── coupon.js
│   ├── review.js
│   ├── transaction.js
│   ├── profile.js
│   └── wishlist.js
│
├── 📂 middlewares/
│   ├── 📂 auth/                # Authentication middleware
│   └── 📂 email/               # Email service
│       ├── config.js
│       ├── emailService.js
│       └── templates.js
│
├── 📂 models/                  # Mongoose schemas
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── coupon.js
│   ├── review.js
│   ├── transactions.js
│   └── profile.js
│
├── 📂 routes/                  # API routes
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   └── ...
│
├── 📂 scripts/
│   └── seed.js                 # Database seeder
│
├── 📂 utils/
│   ├── cloudinary.js           # Cloudinary config
│   ├── db.js                   # Database connection
│   └── token.js                # JWT utilities
│
├── index.js                    # Server entry point
├── package.json
└── .env.example
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary Account
- Razorpay Account
- Gmail Account (for email service)

### 1. Clone the Repository
```bash
git clone https://github.com/KRISHNA-JAIN15/Opulence.git
cd opulence
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/opulence

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:4000

# Razorpay (Payment Gateway)
RAZORPAY_API_KEY=your_razorpay_key_id
RAZORPAY_API_SECRET=your_razorpay_key_secret
```

### 5. Run the Application

**Development Mode (with hot reload):**

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Production Mode:**

```bash
# Build frontend
cd client
npm run build

# Start server
cd ..
npm start
```

### 6. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/signup` | Register new user |
| POST | `/api/users/login` | User login |
| POST | `/api/users/logout` | User logout |
| POST | `/api/users/verify-email` | Verify email with OTP |
| POST | `/api/users/resend-verification` | Resend verification code |
| POST | `/api/users/forgot-password` | Request password reset |
| POST | `/api/users/reset-password` | Reset password |
| GET | `/api/users/profile` | Get user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/discounted` | Get discounted products |
| GET | `/api/products/categories` | Get all categories |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| POST | `/api/orders/razorpay/create` | Create Razorpay order |
| POST | `/api/orders/razorpay/verify` | Verify payment |
| GET | `/api/orders/admin/all` | Get all orders (Admin) |
| PUT | `/api/orders/admin/:id/status` | Update order status (Admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/product/:productId` | Get product reviews |
| POST | `/api/reviews` | Create review |
| PUT | `/api/reviews/:id` | Update review |
| DELETE | `/api/reviews/:id` | Delete review |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get user wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |

### Coupons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coupons` | Get all coupons (Admin) |
| POST | `/api/coupons` | Create coupon (Admin) |
| PUT | `/api/coupons/:id` | Update coupon (Admin) |
| DELETE | `/api/coupons/:id` | Delete coupon (Admin) |
| POST | `/api/coupons/validate` | Validate coupon code |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions (Admin) |
| GET | `/api/transactions/summary` | Get transaction summary (Admin) |

---

## 🔐 Security Features

- 🔒 **JWT Authentication** with secure token handling
- 🔑 **Password Hashing** using bcryptjs
- 📧 **Email Verification** for new accounts
- 🛡️ **CORS Protection** configured for trusted origins
- 🚫 **Rate Limiting** on sensitive endpoints
- ✅ **Input Validation** on all API routes
- 🔐 **Secure Payment** via Razorpay signature verification

---

## 📧 Email Notifications

The platform sends automated emails for:
- ✉️ Email verification (6-digit OTP)
- 👋 Welcome email after verification
- 🔑 Password reset links
- 📦 Order confirmation
- 🚚 Order status updates (shipped, delivered)
- ❌ Order cancellation confirmation
- 🎫 Promotional coupon announcements

---

## 💳 Payment Integration

**Razorpay Integration Features:**
- Secure payment processing
- Multiple payment methods (Cards, UPI, Net Banking, Wallets)
- Payment verification with signature validation
- Refund processing for cancelled orders
- INR currency support

---

## 🎨 UI/UX Features

- 🌙 Modern, clean design with premium aesthetics
- 📱 Fully responsive (mobile-first approach)
- ⚡ Fast page loading with skeleton loaders
- 🔔 Toast notifications for user feedback
- 🔄 Real-time price sync for cart items
- 🎭 Error boundaries for graceful error handling
- ⬆️ Scroll to top on navigation

---

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm start         # Start production server
npm run dev       # Start development server with nodemon
```

**Frontend:**
```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Seeding Database
```bash
node scripts/seed.js
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Krishna Jain**

- GitHub: [@KRISHNA-JAIN15](https://github.com/KRISHNA-JAIN15)

---

<div align="center">

⭐ **Star this repo if you find it helpful!** ⭐

Made with ❤️ by Krishna Jain

</div>
