import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-orders");
  const [orders, setOrders] = useState([]);

  const sidebarItems = [
    { id: "all-orders", label: "All Orders", icon: "📦" },
    { id: "all-sellers", label: "All Sellers", icon: "🏪" },
    { id: "all-users", label: "All Users", icon: "👥" },
    { id: "all-products", label: "All Products", icon: "📱" },
    { id: "all-events", label: "All Events", icon: "🎉" },
    { id: "withdraw-requests", label: "Withdraw Requests", icon: "💰" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "all-orders":
        return <AllOrders orders={orders} />;
      case "all-sellers":
        return <AllSellers />;
      case "all-users":
        return <AllUsers />;
      case "all-products":
        return <AllProducts />;
      case "all-events":
        return <AllEvents />;
      case "withdraw-requests":
        return <WithdrawRequests />;
      default:
        return <AllOrders />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your platform</p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

// All Orders Component
const AllOrders = ({ orders }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Order ID
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Customer
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Amount
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-blue-600 font-medium">
                  {order.id}
                </td>
                <td className="py-4 px-6">{order.customer}</td>
                <td className="py-4 px-6">{order.seller}</td>
                <td className="py-4 px-6 font-semibold">{order.amount}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Sellers Component
const AllSellers = () => {
  const sellers = [
    {
      id: 1,
      name: "TechStore",
      email: "tech@store.com",
      products: 45,
      status: "Active",
      joined: "2023-12-01",
    },
    {
      id: 2,
      name: "Fashion Hub",
      email: "info@fashion.com",
      products: 123,
      status: "Active",
      joined: "2023-11-15",
    },
    {
      id: 3,
      name: "Electronics Plus",
      email: "hello@electronics.com",
      products: 67,
      status: "Pending",
      joined: "2024-01-10",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Sellers</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Shop Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Email
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Products
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Joined
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{seller.name}</td>
                <td className="py-4 px-6 text-gray-600">{seller.email}</td>
                <td className="py-4 px-6">{seller.products}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      seller.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {seller.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500">{seller.joined}</td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Users Component
const AllUsers = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@email.com",
      orders: 12,
      status: "Active",
      joined: "2023-10-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@email.com",
      orders: 8,
      status: "Active",
      joined: "2023-11-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@email.com",
      orders: 5,
      status: "Inactive",
      joined: "2024-01-05",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Email
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Orders
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Joined
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{user.name}</td>
                <td className="py-4 px-6 text-gray-600">{user.email}</td>
                <td className="py-4 px-6">{user.orders}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500">{user.joined}</td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Products Component
const AllProducts = () => {
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      seller: "TechStore",
      price: "$999",
      stock: 25,
      status: "Active",
    },
    {
      id: 2,
      name: "Nike Air Max",
      seller: "Fashion Hub",
      price: "$120",
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 3,
      name: "MacBook Pro",
      seller: "Electronics Plus",
      price: "$1499",
      stock: 12,
      status: "Active",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Product Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Price
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Stock
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{product.name}</td>
                <td className="py-4 px-6">{product.seller}</td>
                <td className="py-4 px-6 font-semibold">{product.price}</td>
                <td className="py-4 px-6">{product.stock}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Events Component
const AllEvents = () => {
  const events = [
    {
      id: 1,
      name: "Black Friday Sale",
      seller: "TechStore",
      startDate: "2024-11-29",
      endDate: "2024-12-02",
      status: "Upcoming",
    },
    {
      id: 2,
      name: "Summer Collection",
      seller: "Fashion Hub",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "Completed",
    },
    {
      id: 3,
      name: "Electronics Clearance",
      seller: "Electronics Plus",
      startDate: "2024-01-15",
      endDate: "2024-01-31",
      status: "Active",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Event Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Start Date
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                End Date
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{event.name}</td>
                <td className="py-4 px-6">{event.seller}</td>
                <td className="py-4 px-6">{event.startDate}</td>
                <td className="py-4 px-6">{event.endDate}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : event.status === "Upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Withdraw Requests Component
const WithdrawRequests = () => {
  const requests = [
    {
      id: 1,
      seller: "TechStore",
      amount: "$2,450.00",
      method: "Bank Transfer",
      status: "Pending",
      date: "2024-01-17",
    },
    {
      id: 2,
      seller: "Fashion Hub",
      amount: "$1,200.00",
      method: "PayPal",
      status: "Approved",
      date: "2024-01-16",
    },
    {
      id: 3,
      seller: "Electronics Plus",
      amount: "$3,750.00",
      method: "Bank Transfer",
      status: "Processing",
      date: "2024-01-15",
    },
  ];

  const handleApprove = (id) => {
    console.log("Approving request:", id);
  };

  const handleReject = (id) => {
    console.log("Rejecting request:", id);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Withdraw Requests
      </h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Amount
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Method
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Date
              </th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{request.seller}</td>
                <td className="py-4 px-6 font-semibold text-green-600">
                  {request.amount}
                </td>
                <td className="py-4 px-6">{request.method}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500">{request.date}</td>
                <td className="py-4 px-6">
                  {request.status === "Pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {request.status !== "Pending" && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
