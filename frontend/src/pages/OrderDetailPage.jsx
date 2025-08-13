import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // for URL params and navigation
import {
  MapPin,
  CreditCard,
  Phone,
  ArrowLeft,
  MessageCircle,
  Star,
  Copy,
  X,
} from "lucide-react";
import { server } from "../Data";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

export default function OrderDetailsPage() {
  const { id } = useParams(); // get orderId from url params
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${server}/order/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);
  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      return toast("Please fill all fields");
    }

    try {
      await axios.post(
        `${server}/reviews`,
        {
          productId: selectedProduct._id, // ✅ send product ID
          orderId: order._id, // optional: for backend validation
          rating,
          comment: reviewText,
        },
        { withCredentials: true }
      );

      toast.success(`Review submitted for ${selectedProduct.name}!`);
      setReviewDialogOpen(false);
      setRating(0);
      setReviewText("");

      // ✅ Mark only that product as reviewed in state
      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product._id === selectedProduct._id
            ? { ...item, review: true }
            : item
        ),
      }));
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while submitting review"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader></Loader>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => navigate("/dashboard")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-10 ">
      <div className="max-w-6xl rounded-4xl  py-8 px-16  mx-auto">
        {/* Header */}
        <div className="bg-accent   relative rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center  justify-between mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            <div className="flex gap-2">
              {order.status === "delivered" && (
                <button
                  onClick={() => setReviewDialogOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Review
                </button>
              )}

              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm">
                <MessageCircle className="w-4 h-4" />
                Contact shop
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Order Details
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Order ID:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {order._id}
                  </code>
                  <button
                    onClick={() => handleCopy(order.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {copied && (
                  <span className="text-xs text-green-600">Copied!</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-accent  rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{order.shopId.shopName}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{order.shopId.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg"
                  >
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl"
                    ></img>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.product.name}
                      </h3>

                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${item.finalPrice * item.quantity}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.finalPrice.toFixed(2)} each
                      </div>
                    </div>
                    {!item.review && (
                      <button
                        onClick={() => {
                          setSelectedProduct(item.product);
                          setReviewDialogOpen(true);
                        }}
                        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                      >
                        Add Review
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Details */}

          {/* Order Summary */}
          <div className="bg-accent  rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  ${order.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-accent  rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-600">
                {order.payment.method}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-accent  rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-gray-900">
                    {order.shipping.address}
                  </div>
                  <div>{order.shipping.city}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {order.shipping.phone}
                </span>
              </div>
            </div>
          </div>

          {/* shopId Contact */}
          <div className="bg-accent  rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              shopId Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={order.shopId.logo.url}
                  alt=""
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {order.shopId.shopName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{order.shopId.rating} rating</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {order.shopId.phone}
                </span>
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                Contact shopId
              </button>
            </div>
          </div>
        </div>
        {reviewDialogOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
              <button
                onClick={() => {
                  setReviewDialogOpen(false);
                  setSelectedProduct(null);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold mb-4">
                Add Review for "{selectedProduct.name}"
              </h2>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-6 h-6 cursor-pointer ${
                      rating >= star
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              />

              {/* Submit */}
              <button
                onClick={handleSubmitReview}
                disabled={selectedProduct.reviewed}
                className={`w-full py-2 rounded-lg ${
                  selectedProduct.reviewed
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {selectedProduct.reviewed
                  ? "Review Submitted"
                  : "Submit Review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
