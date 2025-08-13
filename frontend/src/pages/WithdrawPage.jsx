import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../Data";
import { useSelector } from "react-redux";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const [iban, setIban] = useState("");
  const [stats, setStats] = useState({
    totalDeliveredRevenue: 0,
    deliveredOrdersCount: 0,
    totalRequestedWithdrawals: 0,
    availableBalance: 0,
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { seller } = useSelector((state) => state.seller);

  // Fetch stats + withdrawals
  useEffect(() => {
    async function fetchData() {
      try {
        setFetching(true);

        const [statsRes, withdrawRes] = await Promise.all([
          axios.get(`${server}/dashboard/stats/delivered`, {
            withCredentials: true,
          }),
          axios.get(`${server}/withdrawals`, { withCredentials: true }),
        ]);

        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }
        if (withdrawRes.data?.withdrawals) {
          setWithdrawals(withdrawRes.data.withdrawals);
        }
      } catch (err) {
        toast.error("Failed to fetch data");
        console.error(err);
      } finally {
        setFetching(false);
      }
    }

    fetchData();
  }, [seller]);

  const handleWithdraw = async () => {
    if (
      !amount ||
      parseFloat(amount) <= 0 ||
      parseFloat(amount) > stats.availableBalance
    ) {
      toast.error("Please enter a valid amount within your available balance");
      return;
    }
    if (!iban.trim()) {
      toast.error("Please enter your IBAN number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${server}/withdrawals`,
        { amount: parseFloat(amount), iban },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Withdrawal request submitted");
      setAmount("");
      setIban("");
      setShowDialog(false);

      // Refresh both stats and withdrawals list
      const [statsRes, withdrawRes] = await Promise.all([
        axios.get(`${server}/dashboard/stats/delivered`, {
          withCredentials: true,
        }),
        axios.get(`${server}/withdrawals`, { withCredentials: true }),
      ]);

      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
      if (withdrawRes.data?.withdrawals) {
        setWithdrawals(withdrawRes.data.withdrawals);
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error(
        error.response?.data?.message || "Withdrawal failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(String(stats.availableBalance));
  };

  const closeDialog = () => {
    setShowDialog(false);
    setAmount("");
    setIban("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Withdrawals</h1>
        <p className="text-gray-600">
          Manage your earnings and withdrawal requests
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalDeliveredRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.deliveredOrdersCount} delivered orders
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Available Balance Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${stats.availableBalance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Withdrawals Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Withdrawals
              </p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                ${stats.totalRequestedWithdrawals.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Being processed</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Request Withdrawal Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Action</p>
              <button
                onClick={() => setShowDialog(true)}
                disabled={stats.availableBalance <= 0}
                className={`mt-2 w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  stats.availableBalance <= 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
                }`}
              >
                Request Withdrawal
              </button>
              {stats.availableBalance <= 0 && (
                <p className="text-xs text-gray-500 mt-1">No funds available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawals History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Withdrawal History
          </h2>
        </div>

        <div className="p-6">
          {fetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-500">
                Loading withdrawal history...
              </span>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No withdrawals yet
              </h3>
              <p className="text-gray-500">
                Your withdrawal history will appear here once you make your
                first request.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IBAN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {withdrawals.map((w, index) => (
                    <tr
                      key={w._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(w.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${w.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {w.iban}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            w.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : w.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : w.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {w.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Request Withdrawal
              </h3>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              {/* Available Balance Display */}
              <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">
                    Available Balance:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    ${stats.availableBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    max={stats.availableBalance}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  />
                </div>
                {parseFloat(amount) > stats.availableBalance && (
                  <p className="text-red-500 text-sm mt-1">
                    Amount exceeds available balance
                  </p>
                )}
              </div>

              {/* IBAN Input */}
              <div className="mb-6">
                <label
                  htmlFor="iban"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  IBAN Number
                </label>
                <input
                  type="text"
                  id="iban"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="Enter your IBAN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    onClick={() =>
                      setAmount(String(Math.min(amt, stats.availableBalance)))
                    }
                    disabled={amt > stats.availableBalance}
                    className={`py-2 px-2 rounded-lg transition-colors text-sm font-medium ${
                      amt > stats.availableBalance
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <button
                  onClick={setMaxAmount}
                  disabled={stats.availableBalance <= 0}
                  className={`py-2 px-2 rounded-lg transition-colors text-sm font-medium ${
                    stats.availableBalance <= 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  Max
                </button>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeDialog}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={
                    loading ||
                    !amount ||
                    !iban ||
                    parseFloat(amount) > stats.availableBalance ||
                    parseFloat(amount) <= 0
                  }
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    loading ||
                    !amount ||
                    !iban ||
                    parseFloat(amount) > stats.availableBalance ||
                    parseFloat(amount) <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;
