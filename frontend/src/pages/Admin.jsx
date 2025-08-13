import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../Data";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-orders");
  const { user } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const { seller } = useSelector((state) => state.seller);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const [withdrawals, setwithdrawals] = useState([]);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!seller && !user) return;
    if (
      (seller && seller.email === "asifr.official9@gmail.com") ||
      (user && user.email === "asifr.official9@gmail.com")
    )
      setAdmin(true);
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${server}/order/admin/all`, {
          withCredentials: true,
        });
        setOrders(res.data.orders); // handle your data here
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchwithdrawals = async () => {
      try {
        const res = await axios.get(`${server}/withdrawals/admin/all`, {
          withCredentials: true,
        });
        setwithdrawals(res.data.withdrawal); // handle your data here
      } catch (error) {
        toast.error(error);
      }
    };
    fetchwithdrawals();
    const fetchSeller = async () => {
      try {
        const res = await axios.get(`${server}/shops/admin/all`, {
          withCredentials: true,
        });
        setSellers(res.data.sellers); // handle your data here
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchusers = async () => {
      try {
        const res = await axios.get(`${server}/user/admin/all`, {
          withCredentials: true,
        });
        setUsers(res.data.users); // handle your data here
      } catch (error) {
        toast.error(error);
      }
    };
    fetchusers();
    fetchOrders();
    fetchSeller();
  }, [user, seller]);

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
        return <AllSellers sellers={sellers} />;
      case "all-users":
        return <AllUsers users={users} />;
      case "all-products":
        return <AllProducts products={products} />;
      case "all-events":
        return <AllEvents events={events} />;
      case "withdraw-requests":
        return <WithdrawRequests withdrawals={withdrawals} />;
      default:
        return <AllOrders />;
    }
  };
  if (admin) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <div className="w-64 bg-sidebar shadow-sm border-r">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-foreground">
              Admin Dashboard
            </h1>
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
                        ? "bg-primary text-primary-foreground border-r-2 border-primary-dark"
                        : "text-foreground hover:bg-accent"
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
  }
  return <div> unauthoried</div>;
};

// All Orders Component
const AllOrders = ({ orders }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">All Orders</h2>
      <div className="bg-accent rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-primary-foreground">
                Order ID
              </th>
              <th className="text-left py-3 px-6 font-semibold text-primary-foreground">
                Customer
              </th>
              <th className="text-left py-3 px-6 font-semibold text-primary-foreground">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-primary-foreground">
                Amount
              </th>
              <th className="text-left py-3 px-6 font-semibold text-primary-foreground">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-primary-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-primary font-medium">
                  <a href={`/order/${order._id}`}> {order._id}</a>
                </td>
                <td className="py-4 px-6">{order.user.full_name}</td>
                <td className="py-4 px-6">{order.shopId.shopName}</td>
                <td className="py-4 px-6 font-semibold">{order.total}</td>
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
                <td className="py-4 px-6 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Sellers Component
const AllSellers = ({ sellers }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">All Sellers</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Shop Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Email
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                owner
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{seller.shopName}</td>
                <td className="py-4 px-6 text-gray-600">{seller.email}</td>
                <td className="py-4 px-6">{seller.ownerName}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      seller.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {seller.isActive ? "yes" : "no"}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </td>{" "}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Users Component
const AllUsers = ({ users }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">All Users</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Email
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Verified
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{user.full_name}</td>
                <td className="py-4 px-6 text-gray-600">{user.email}</td>

                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isVerified
                        ? "bg-green-300 text-green-800"
                        : "bg-border text-gray-800"
                    }`}
                  >
                    {user.isVerified.toString()}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
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
const AllProducts = ({ products }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">All Products</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Product Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Price
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Stock
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">
                  {product.name.slice(0, 50)}
                </td>
                <td className="py-4 px-6">{product.shop.shopName}</td>
                <td className="py-4 px-6 font-semibold">
                  {product.DiscountPrice
                    ? product.DiscountPrice
                    : product.price}
                </td>
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
                  <button className="text-primary hover:text-blue-800 text-sm font-medium mr-3">
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
const AllEvents = ({ events }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">All Events</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Event Name
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Start Date
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                End Date
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">
                  {event.product.name.slice(0, 20)}
                </td>
                <td className="py-4 px-6">{event.shop.shopName}</td>
                <td className="py-4 px-6">
                  {new Date(event.startDateTime).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  {new Date(event.endDateTime).toLocaleDateString()}
                </td>

                <td className="py-4 px-6">
                  <button className="text-primary hover:text-blue-800 text-sm font-medium">
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
const WithdrawRequests = ({ withdrawals }) => {
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${server}/withdrawals/${id}/status`,
        { status: "approved" },
        { withCredentials: true }
      );
      toast("Request approved!");
      window.location.reload(); // Refresh data after update
    } catch (err) {
      console.error(err);
      toast("Failed to approve request.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${server}/withdrawals/${id}/status`,
        { status: "rejected" },
        { withCredentials: true }
      );
      toast("Request rejected!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast("Failed to reject request.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Withdraw Requests
      </h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Seller
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Amount
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Iban
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Status
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Date
              </th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {withdrawals.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">
                  {request.sellerId.shopName}
                </td>
                <td className="py-4 px-6 font-semibold text-green-600">
                  {request.amount}
                </td>
                <td className="py-4 px-6">{request.iban}</td>
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
                <td className="py-4 px-6 text-gray-500">{request.createdAt}</td>
                <td className="py-4 px-6">
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {request.status !== "pending" && (
                    <button className="text-primary hover:text-blue-800 text-sm font-medium">
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
