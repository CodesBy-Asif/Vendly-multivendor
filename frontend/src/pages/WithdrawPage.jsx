import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const [stats, setStats] = useState({
    totalDeliveredRevenue: 0,
    deliveredOrdersCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await axios.get("/api/dashboard/stats/delivered"); // Adjust API path as needed
        if (response.data && response.data.stats) {
          setStats(response.data.stats);
        }
      } catch (err) {
        setError("Failed to fetch stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);
  const handleWithdraw = async () => {
    if (
      !amount ||
      parseFloat(amount) <= 0 ||
      parseFloat(amount) > stats.totalDeliveredRevenue
    ) {
      toast.error("Please enter a valid amount");
      return;
    }
    console.log(parseFloat(amount) > stats.totalDeliveredRevenue);
    setLoading(true);
    try {
      // Add your withdraw API call here
      console.log("Withdrawing amount:", amount);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`Successfully withdrew $${amount}`);
      setAmount("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Money</h1>
          <p className="text-gray-600 mt-2">
            Enter the amount you want to withdraw
          </p>
        </div>

        {/* Available Balance (Optional - you can connect this to your state) */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Available Balance:</span>
            <span className="text-xl font-semibold text-gray-900">
              ${stats.totalDeliveredRevenue}
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
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
              step="0.01"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setAmount("50")}
            className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            $50
          </button>
          <button
            onClick={() => setAmount("100")}
            className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            $100
          </button>
          <button
            onClick={() => setAmount("200")}
            className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            $200
          </button>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={loading || !amount}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            loading || !amount
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
            "Withdraw Money"
          )}
        </button>

        {/* Info Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Withdrawals are processed within 24 hours. Standard banking fees may
            apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
