const express = require("express");
const {
  getTransactions,
  getTransactionSummary,
  exportTransactions,
} = require("../controllers/transaction");
const { authenticateToken, adminOnly } = require("../middlewares/auth/auth");

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken, adminOnly);

// Get all transactions
router.get("/", getTransactions);

// Get transaction summary/analytics
router.get("/summary", getTransactionSummary);

// Export transactions as CSV
router.get("/export", exportTransactions);

module.exports = router;
