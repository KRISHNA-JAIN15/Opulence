import { useState, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Percent,
  Box,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    flowType: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== "page" && key !== "limit") {
          params.append(key, value);
        }
      });

      const response = await axios.get(
        `${API_URL}/transactions/export?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `transactions-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch transactions
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await axios.get(
          `${API_URL}/transactions?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTransactions(response.data.transactions);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total,
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }

      // Fetch summary
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();

        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const response = await axios.get(
          `${API_URL}/transactions/summary?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }

      setLoading(false);
    };
    loadData();
  }, [filters]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "sale":
        return <ShoppingCart className="w-4 h-4" />;
      case "inventory_add":
        return <Box className="w-4 h-4" />;
      case "refund":
        return <RefreshCw className="w-4 h-4" />;
      case "coupon_discount":
        return <Percent className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800";
      case "inventory_add":
        return "bg-blue-100 text-blue-800";
      case "refund":
        return "bg-red-100 text-red-800";
      case "coupon_discount":
        return "bg-purple-100 text-purple-800";
      case "expense":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFlowIcon = (flowType) => {
    return flowType === "inflow" ? (
      <ArrowUpRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-500" />
    );
  };

  // eslint-disable-next-line no-unused-vars
  const SummaryCard = ({
    title,
    value,
    subValue,
    icon: IconComponent,
    color,
    trend,
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subValue && (
            <p
              className={`text-sm mt-1 ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {subValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">
            Track your business finances and analytics
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={() => setFilters({ ...filters })}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <SummaryCard
              title="Total Inflow"
              value={formatCurrency(summary?.overall?.totalInflow)}
              subValue={`${summary?.overall?.totalOrders || 0} orders`}
              icon={TrendingUp}
              color="bg-green-500"
            />
            <SummaryCard
              title="Total Outflow"
              value={formatCurrency(summary?.overall?.totalOutflow)}
              subValue={`Refunds: ${formatCurrency(
                summary?.byType?.find((t) => t._id === "refund")?.totalAmount ||
                  0
              )}`}
              icon={TrendingDown}
              color="bg-red-500"
            />
            <SummaryCard
              title="Net Balance"
              value={formatCurrency(summary?.overall?.netBalance)}
              subValue={
                summary?.overall?.netBalance >= 0
                  ? "You're in profit!"
                  : "You're at loss"
              }
              icon={DollarSign}
              color={
                summary?.overall?.netBalance >= 0
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }
              trend={summary?.overall?.netBalance >= 0 ? "up" : "down"}
            />
            <SummaryCard
              title="Total Cost"
              value={formatCurrency(summary?.overall?.totalCost)}
              icon={Package}
              color="bg-blue-500"
            />
            <SummaryCard
              title="Net Profit"
              value={formatCurrency(summary?.overall?.netProfit)}
              subValue={`${(summary?.overall?.profitMargin || 0).toFixed(
                1
              )}% margin`}
              icon={TrendingUp}
              color="bg-purple-500"
              trend={summary?.overall?.netProfit > 0 ? "up" : "down"}
            />
          </div>

          {/* Cash Flow Summary */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              💰 Cash Flow Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-green-400 text-sm font-medium mb-1">
                  Total Money In
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {formatCurrency(summary?.overall?.totalInflow)}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  From sales, tax, etc.
                </p>
              </div>
              <div className="text-center border-l border-r border-gray-700 px-4">
                <p className="text-red-400 text-sm font-medium mb-1">
                  Total Money Out
                </p>
                <p className="text-3xl font-bold text-red-400">
                  {formatCurrency(summary?.overall?.totalOutflow)}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Refunds, inventory costs
                </p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-1">
                  Net Position
                </p>
                <p
                  className={`text-3xl font-bold ${
                    summary?.overall?.netBalance >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {summary?.overall?.netBalance >= 0 ? "+" : ""}
                  {formatCurrency(summary?.overall?.netBalance)}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {summary?.overall?.netBalance >= 0
                    ? "You're profitable! 🎉"
                    : "Watch your expenses"}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(
                      summary?.byType?.find((t) => t._id === "sale")
                        ?.totalAmount || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Percent className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tax Collected</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(summary?.overall?.totalTaxCollected || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Box className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inventory Investment</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(
                      summary?.byType?.find((t) => t._id === "inventory_add")
                        ?.totalAmount || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Refunds</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(
                      summary?.byType?.find((t) => t._id === "refund")
                        ?.totalAmount || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          {summary?.topProducts && summary.topProducts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Top Selling Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summary.topProducts.slice(0, 6).map((product, index) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.totalSold} sold •{" "}
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Filters:
                </span>
              </div>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value, page: 1 })
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="">All Types</option>
                <option value="sale">Sales</option>
                <option value="inventory_add">Inventory</option>
                <option value="refund">Refunds</option>
                <option value="expense">Expenses</option>
                <option value="coupon_discount">Coupon Discounts</option>
              </select>

              <select
                value={filters.flowType}
                onChange={(e) =>
                  setFilters({ ...filters, flowType: e.target.value, page: 1 })
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="">All Flows</option>
                <option value="inflow">Inflow</option>
                <option value="outflow">Outflow</option>
              </select>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      startDate: e.target.value,
                      page: 1,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value, page: 1 })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <button
                onClick={() =>
                  setFilters({
                    type: "",
                    flowType: "",
                    startDate: "",
                    endDate: "",
                    page: 1,
                    limit: 20,
                  })
                }
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flow
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Margin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!transactions || transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr key={txn._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(txn.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(
                              txn.type
                            )}`}
                          >
                            {getTypeIcon(txn.type)}
                            {txn.type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {txn.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {getFlowIcon(txn.flowType)}
                            <span className="text-sm text-gray-600 capitalize">
                              {txn.flowType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <span
                            className={
                              txn.flowType === "inflow"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {txn.flowType === "inflow" ? "+" : "-"}
                            {formatCurrency(txn.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {txn.costAmount
                            ? formatCurrency(txn.costAmount)
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          {txn.profit !== undefined && txn.profit !== null ? (
                            <span
                              className={
                                txn.profit >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {formatCurrency(txn.profit)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {txn.margin !== undefined && txn.margin !== null
                            ? `${txn.margin.toFixed(1)}%`
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * filters.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;
