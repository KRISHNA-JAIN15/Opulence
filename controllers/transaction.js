const Transaction = require("../models/transactions");
const Order = require("../models/order");
const Product = require("../models/product");

// @desc    Get all transactions with filters
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = async (req, res) => {
  try {
    const {
      type,
      flowType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (flowType) {
      filter.flowType = flowType;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("product", "name image")
      .populate("user", "name email")
      .populate("order", "orderNumber");

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      transactions: transactions,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

// @desc    Get transaction summary/analytics
// @route   GET /api/transactions/summary
// @access  Private/Admin
const getTransactionSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = end;
      }
    }

    // Get all transactions in date range
    const transactions = await Transaction.find(dateFilter);

    // Calculate totals
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalTaxCollected = 0;
    let salesCount = 0;
    let refundCount = 0;
    let inventoryAddCount = 0;

    const byType = {
      sale: { count: 0, amount: 0, profit: 0 },
      tax_collected: { count: 0, amount: 0 },
      inventory_add: { count: 0, amount: 0 },
      refund: { count: 0, amount: 0 },
      expense: { count: 0, amount: 0 },
      coupon_discount: { count: 0, amount: 0 },
    };

    transactions.forEach((txn) => {
      if (txn.flowType === "inflow") {
        totalInflow += txn.amount;
      } else {
        totalOutflow += txn.amount;
      }

      if (txn.type === "sale") {
        totalRevenue += txn.amount;
        totalCost += txn.costAmount || 0;
        totalProfit += txn.profit || 0;
        // Extract tax from metadata (now embedded in sale transactions)
        totalTaxCollected += txn.metadata?.tax || 0;
        salesCount++;
        byType.sale.count++;
        byType.sale.amount += txn.amount;
        byType.sale.profit += txn.profit || 0;
      } else if (txn.type === "tax_collected") {
        // Legacy support for old tax_collected transactions
        totalTaxCollected += txn.amount;
        byType.tax_collected.count++;
        byType.tax_collected.amount += txn.amount;
      } else if (txn.type === "refund") {
        refundCount++;
        byType.refund.count++;
        byType.refund.amount += txn.amount;
      } else if (txn.type === "inventory_add") {
        inventoryAddCount++;
        byType.inventory_add.count++;
        byType.inventory_add.amount += txn.amount;
      } else if (txn.type === "expense") {
        byType.expense.count++;
        byType.expense.amount += txn.amount;
      } else if (txn.type === "coupon_discount") {
        byType.coupon_discount.count++;
        byType.coupon_discount.amount += txn.amount;
      }
    });

    const avgMargin = salesCount > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const netBalance = totalInflow - totalOutflow;

    // Get daily breakdown for charts
    const dailyBreakdown = await Transaction.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$type", "sale"] }, "$amount", 0],
            },
          },
          profit: {
            $sum: {
              $cond: [{ $eq: ["$type", "sale"] }, "$profit", 0],
            },
          },
          cost: {
            $sum: {
              $cond: [{ $eq: ["$type", "sale"] }, "$costAmount", 0],
            },
          },
          inflow: {
            $sum: {
              $cond: [{ $eq: ["$flowType", "inflow"] }, "$amount", 0],
            },
          },
          outflow: {
            $sum: {
              $cond: [{ $eq: ["$flowType", "outflow"] }, "$amount", 0],
            },
          },
          salesCount: {
            $sum: {
              $cond: [{ $eq: ["$type", "sale"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Transaction.aggregate([
      { $match: { ...dateFilter, type: "sale" } },
      {
        $group: {
          _id: "$product",
          totalSales: { $sum: "$amount" },
          totalProfit: { $sum: "$profit" },
          quantity: { $sum: "$quantity" },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    ]);

    res.status(200).json({
      success: true,
      overall: {
        totalRevenue,
        totalCost,
        netProfit: totalProfit,
        profitMargin: avgMargin,
        totalInflow,
        totalOutflow,
        netBalance,
        totalTaxCollected,
        totalOrders: salesCount,
        refundCount,
        inventoryAddCount,
      },
      byType: [
        {
          _id: "sale",
          count: byType.sale.count,
          totalAmount: byType.sale.amount,
          profit: byType.sale.profit,
        },
        {
          _id: "tax_collected",
          count: byType.tax_collected.count,
          totalAmount: byType.tax_collected.amount,
        },
        {
          _id: "inventory_add",
          count: byType.inventory_add.count,
          totalAmount: byType.inventory_add.amount,
        },
        {
          _id: "refund",
          count: byType.refund.count,
          totalAmount: byType.refund.amount,
        },
        {
          _id: "expense",
          count: byType.expense.count,
          totalAmount: byType.expense.amount,
        },
        {
          _id: "coupon_discount",
          count: byType.coupon_discount.count,
          totalAmount: byType.coupon_discount.amount,
        },
      ],
      dailyBreakdown,
      topProducts: topProducts.map((p) => ({
        _id: p._id,
        productName: p.product?.name || "Unknown Product",
        totalSold: p.quantity || 0,
        revenue: p.totalSales || 0,
        profit: p.totalProfit || 0,
      })),
    });
  } catch (error) {
    console.error("Get transaction summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction summary",
    });
  }
};

// @desc    Record a transaction (for internal use)
// @access  Private
const recordTransaction = async (transactionData) => {
  try {
    const transaction = await Transaction.create(transactionData);
    return transaction;
  } catch (error) {
    console.error("Record transaction error:", error);
    throw error;
  }
};

// @desc    Record sale transactions from order
// @access  Private
const recordSaleFromOrder = async (order) => {
  try {
    const transactions = [];

    // Calculate total subtotal to determine tax ratio per item
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalTax = order.pricing?.tax || 0;

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      const itemSubtotal = item.price * item.quantity;

      // Calculate proportional tax for this item
      const itemTaxRatio = subtotal > 0 ? itemSubtotal / subtotal : 0;
      const itemTax = totalTax * itemTaxRatio;

      // Total amount = subtotal + proportional tax (this is what user actually paid for this item)
      const totalAmount = itemSubtotal + itemTax;

      const costPrice = (product?.costPrice || 0) * item.quantity;
      const discount = item.discount || 0;
      const profit = totalAmount - costPrice - discount;
      const margin = totalAmount > 0 ? (profit / totalAmount) * 100 : 0;

      const txn = await Transaction.create({
        type: "sale",
        order: order._id,
        product: item.product,
        user: order.user,
        amount: totalAmount, // Full amount including tax
        costAmount: costPrice,
        profit,
        margin,
        description: `Sale: ${item.name} x ${
          item.quantity
        } (incl. tax ₹${itemTax.toFixed(2)})`,
        quantity: item.quantity,
        sellingPrice: item.price,
        discount,
        flowType: "inflow",
        status: "completed",
        metadata: {
          orderNumber: order.orderNumber,
          productName: item.name,
          subtotal: itemSubtotal,
          tax: itemTax,
        },
      });
      transactions.push(txn);
    }

    // Record coupon discount if any
    if (order.pricing?.couponDiscount > 0) {
      await Transaction.create({
        type: "coupon_discount",
        order: order._id,
        user: order.user,
        amount: order.pricing.couponDiscount,
        description: `Coupon discount: ${order.couponCode || "Applied"}`,
        flowType: "outflow",
        couponCode: order.couponCode,
        couponDiscount: order.pricing.couponDiscount,
        status: "completed",
        metadata: {
          orderNumber: order.orderNumber,
        },
      });
    }

    return transactions;
  } catch (error) {
    console.error("Record sale from order error:", error);
    throw error;
  }
};

// @desc    Record inventory addition transaction
// @access  Private
const recordInventoryAdd = async (product, quantity, costPerUnit) => {
  try {
    const totalCost = costPerUnit * quantity;

    const transaction = await Transaction.create({
      type: "inventory_add",
      product: product._id,
      amount: totalCost,
      costAmount: totalCost,
      description: `Inventory added: ${product.name} x ${quantity} @ ₹${costPerUnit}/unit`,
      quantity,
      flowType: "outflow",
      status: "completed",
      metadata: {
        productName: product.name,
        costPerUnit,
      },
    });

    return transaction;
  } catch (error) {
    console.error("Record inventory add error:", error);
    throw error;
  }
};

// @desc    Record refund transaction
// @access  Private
const recordRefund = async (order, refundAmount, reason) => {
  try {
    const transaction = await Transaction.create({
      type: "refund",
      order: order._id,
      user: order.user,
      amount: refundAmount,
      description: `Refund for order #${order.orderNumber}: ${
        reason || "Customer refund"
      }`,
      flowType: "outflow",
      status: "completed",
      metadata: {
        orderNumber: order.orderNumber,
        reason,
      },
    });

    return transaction;
  } catch (error) {
    console.error("Record refund error:", error);
    throw error;
  }
};

// @desc    Export transactions as CSV
// @route   GET /api/transactions/export
// @access  Private/Admin
const exportTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, flowType } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (flowType) {
      filter.flowType = flowType;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .populate("product", "name")
      .populate("user", "name email")
      .populate("order", "orderNumber");

    // Build CSV
    const headers = [
      "Date",
      "Type",
      "Flow",
      "Description",
      "Amount",
      "Cost",
      "Profit",
      "Margin %",
      "Quantity",
      "Order #",
      "Product",
      "Customer",
      "Status",
    ];

    const rows = transactions.map((txn) => [
      new Date(txn.createdAt).toISOString().split("T")[0],
      txn.type,
      txn.flowType,
      `"${txn.description.replace(/"/g, '""')}"`,
      txn.amount.toFixed(2),
      (txn.costAmount || 0).toFixed(2),
      (txn.profit || 0).toFixed(2),
      (txn.margin || 0).toFixed(2),
      txn.quantity || 1,
      txn.order?.orderNumber || "-",
      txn.product?.name || "-",
      txn.user?.email || "-",
      txn.status,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transactions_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error("Export transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export transactions",
    });
  }
};

module.exports = {
  getTransactions,
  getTransactionSummary,
  recordTransaction,
  recordSaleFromOrder,
  recordInventoryAdd,
  recordRefund,
  exportTransactions,
};
