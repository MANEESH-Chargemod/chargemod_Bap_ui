import React, { useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import {
  FiCreditCard,
  FiDownload,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiBattery,
  FiMapPin,
  FiCheck,
  FiClock,
  FiX,
} from "react-icons/fi";

const TransactionDetailsPage = () => {
  const { transactionHistory } = useBooking();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filters = [
    { value: "all", label: "All Transactions" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

  const filteredTransactions = transactionHistory.filter((transaction) => {
    const matchesSearch = transaction.stationName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" || transaction.status.toLowerCase() === filter;

    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = transactionDate >= startDate && transactionDate <= endDate;
    }

    return matchesSearch && matchesFilter && matchesDate;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status.toLowerCase()] || colors.completed;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: FiCheck,
      pending: FiClock,
      failed: FiX,
    };
    return icons[status.toLowerCase()] || FiCheck;
  };

  const exportTransactions = () => {
    const csvContent = [
      [
        "Date",
        "Station",
        "Energy (kWh)",
        "Amount (₹)",
        "Status",
        "Transaction ID",
      ],
      ...filteredTransactions.map((t) => [
        t.date,
        t.stationName,
        t.energy,
        t.amount,
        t.status,
        t.id,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="py-6 space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Transaction History</h1>
        <p className="text-sm sm:text-base text-gray-300">
          Track your energy purchases and payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-white mt-1">
                ₹
                {transactionHistory.reduce(
                  (sum, t) => sum + parseFloat(t.amount),
                  0
                )}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiDollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Energy</p>
              <p className="text-2xl font-bold text-white mt-1">
                {transactionHistory.reduce(
                  (sum, t) => sum + parseFloat(t.energy),
                  0
                )}{" "}
                kWh
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FiBattery className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Sessions
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {transactionHistory.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <FiCreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {transactionHistory.length > 0
                  ? Math.round(
                      (transactionHistory.filter(
                        (t) => t.status === "Completed"
                      ).length /
                        transactionHistory.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <FiCheck className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/60 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Date Range */}
          <div className="flex gap-4">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportTransactions}
            className="lg:w-auto w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === filterOption.value
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60">
        <div className="p-6 border-b border-gray-200/60">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Transactions{" "}
            {filteredTransactions.length > 0 &&
              `(${filteredTransactions.length})`}
          </h2>
        </div>

        <div className="p-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FiCreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
              <p className="text-sm text-gray-500 mt-1">
                {transactionHistory.length === 0
                  ? "You haven't made any energy purchases yet"
                  : "Try adjusting your search filters"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => {
                const StatusIcon = getStatusIcon(transaction.status);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/60 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-xl flex items-center justify-center">
                          <FiBattery className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {transaction.stationName}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            <span>{transaction.date}</span>
                            <span className="mx-2">•</span>
                            <FiMapPin className="w-4 h-4 mr-1" />
                            <span>Station</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <FiBattery className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-gray-900">
                              {transaction.energy} kWh
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{transaction.amount}
                          </p>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="font-medium">
                            {transaction.status}
                          </span>
                        </div>

                        <button className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-200">
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsPage;
