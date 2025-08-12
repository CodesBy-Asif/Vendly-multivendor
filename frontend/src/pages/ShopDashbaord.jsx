import { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, ShoppingCart } from "lucide-react";
import { server } from "../Data"; // adjust your server import path

export default function ShopDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const { data } = await axios.get(`${server}/dashboard/stats`, {
          withCredentials: true,
        });
        setDashboardStats(data.stats);
      } catch (err) {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data } = await axios.get(`${server}/orders/recent`, {
          withCredentials: true,
        });
        setRecentOrders(data.orders);
      } catch (err) {
        setError("Failed to load recent orders.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchStats();
    fetchOrders();
  }, []);
  console.log(recentOrders);
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const StatCard = ({ title, value, icon: Icon, prefix = "" }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (loadingStats || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shop Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={dashboardStats?.revenue || 0}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats?.orders || 0}
          icon={ShoppingCart}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Orders
        </h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders available.</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {order._id}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {order.user.full_name}
                    </span>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
