import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  RotateCcw,
  Eye,
  Truck,
} from "lucide-react";
import { server } from "../../../Data";
import axios from "axios";

function OrdersTab() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${server}/order/user/orders`, {
          withCredentials: true, // send cookies/auth headers
        });

        const data = response.data;

        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
  const handleRefund = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to request a refund for this order?"
      )
    )
      return;

    try {
      const res = await axios.post(
        `${server}/refunds/${orderId}`,
        { reason: "Customer requested refund" },
        { withCredentials: true }
      );

      alert(res.data.message || "Refund request sent.");
      fetchOrders(); // refresh orders
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to request refund.");
    }
  };

  const canRefund = (status, method) => {
    // Allow refund if delivered or not yet shipped
    return (
      status === "complete" || (status !== "shipped" && status !== "cancelled")
    );
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-yellow-600" />;
      case "processing":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "processing":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTotalQuantity = (items) =>
    items.reduce((total, item) => total + item.quantity, 0);

  const filterOrders = () => {
    switch (activeTab) {
      case "completed":
        return orders.filter((order) => order.status === "completed");
      case "pending":
        return orders.filter(
          (order) => order.status === "pending" || order.status === "processing"
        );
      case "cancelled":
        return orders.filter((order) => order.status === "cancelled");
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrders();
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredOrders]);
  console.log(filteredOrders);
  const tabs = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "completed",
      label: "Completed",
      count: orders.filter((o) => o.status === "completed").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: orders.filter(
        (o) => o.status === "pending" || o.status === "processing"
      ).length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage all your orders
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            No orders found
          </h3>
          <p className="text-muted-foreground">
            You don't have any orders in this category yet.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b border-border">
            <div className="grid grid-cols-5 gap-6 font-medium text-primary">
              <div>Order ID</div>
              <div>Status</div>
              <div>Total Amount</div>
              <div>Total Items</div>
              <div>Action</div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="grid grid-cols-5 gap-6 items-center">
                  <div>
                    <div className="font-semibold text-primary">
                      {order._id.slice(0, 10)}...
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={getStatusBadge(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-lg">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-primary">
                      {getTotalQuantity(order.items)} items
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.length} products
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/order/${order._id}`}
                      className="flex text-nowrap items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </a>
                    {canRefund(order.status, order.payment.method) && (
                      <button
                        onClick={() => handleRefund(order._id)}
                        className="flex  text-nowrap items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        {order.payment.method === "cod" ? (
                          <span>Cancel</span>
                        ) : (
                          <span>Refund</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-muted/30">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 text-sm bg-muted border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-1 text-sm bg-muted border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrdersTab;
