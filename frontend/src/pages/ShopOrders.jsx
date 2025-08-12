import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Filter,
  Search,
  DollarSign,
  User,
  ChevronDown,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopOrders } from "../redux/actions/order";
import { updateOrder } from "../redux/actions/order";

export default function ShopOrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [processingOrders, setProcessingOrders] = useState({});
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { shopOrders, loading, error } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(fetchShopOrders());
  }, [seller]);
  const statusOptions = [
    { value: "all", label: "All shopOrders", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "processing", label: "Processing", color: "blue" },
    { value: "shipped", label: "Shipped", color: "purple" },
    { value: "delivered", label: "Delivered", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  function calculateTotalQuantity(order) {
    if (!order || !Array.isArray(order.items)) return 0;

    return order.items.reduce((total, item) => {
      const qty = typeof item.quantity === "number" ? item.quantity : 0;
      return total + qty;
    }, 0);
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedData = {
      status: newStatus,
    };

    dispatch(updateOrder(orderId, updatedData));
  };

  const cancelOrder = async (orderId) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      await handleUpdateOrderStatus(orderId, "cancelled");
    }
  };

  const markAsProcessing = async (orderId) => {
    await handleUpdateOrderStatus(orderId, "processing");
  };

  const markAsShipped = async (orderId) => {
    await handleUpdateOrderStatus(orderId, "shipped");
  };

  const filteredOrders = shopOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const orderStats = {
    total: shopOrders.length,
    pending: shopOrders.filter((o) => o.status === "pending").length,
    processing: shopOrders.filter((o) => o.status === "processing").length,
    shipped: shopOrders.filter((o) => o.status === "shipped").length,
    delivered: shopOrders.filter((o) => o.status === "delivered").length,
    revenue: shopOrders.reduce(
      (sum, o) => sum + (o.status !== "cancelled" ? o.totalAmount : 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Manage your shop shopOrders and fulfillment
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-accent rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total shopOrders
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {orderStats.total}
                </p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-accent rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orderStats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-accent rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orderStats.processing}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-accent rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orderStats.shipped}
                </p>
              </div>
              <Truck className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-accent rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orderStats.delivered}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-accent rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${orderStats.revenue.toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-accent rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search shopOrders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-background flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* shopOrders Table */}
        <div className="bg-accent rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="">
              <thead className="bg-accent">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-accent divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  const isProcessingOrder = processingOrders[order._id];

                  return (
                    <tr key={order._id} className="hover:bg-background">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {order._id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {calculateTotalQuantity(order)} items
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {order.user.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.shipping.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.payment.method}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isProcessingOrder ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Updating...</span>
                            </div>
                          ) : (
                            <>
                              {/* Action buttons based on status */}
                              {order.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => markAsProcessing(order._id)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                                  >
                                    Start Processing
                                  </button>
                                  <button
                                    onClick={() => cancelOrder(order._id)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}

                              {order.status === "processing" && (
                                <>
                                  <button
                                    onClick={() => markAsShipped(order._id)}
                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                                  >
                                    Mark Shipped
                                  </button>
                                  <button
                                    onClick={() => cancelOrder(order._id)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}

                              <a
                                href={`/order/${order._id}`}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                View Details
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No shopOrders found
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "shopOrders will appear here when customers place them"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
