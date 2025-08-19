import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Plus,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { server } from "../../../Data";
import { toast } from "react-toastify";

function RefundTab() {
  const [activeTab, setActiveTab] = useState("all");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundDescription, setRefundDescription] = useState("");
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchRefunds() {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${server}/refunds/my-refunds`, {
          withCredentials: true, // include cookies/auth headers
        });
        if (response.data.success) {
          setRefunds(response.data.refunds);
        } else {
          setError("Failed to load refunds.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchRefunds();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "processing":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filterRefunds = () => {
    switch (activeTab) {
      case "approved":
        return refunds.filter((refund) => refund.status === "approved");
      case "pending":
        return refunds.filter(
          (refund) =>
            refund.status === "pending" || refund.status === "processing"
        );
      case "rejected":
        return refunds.filter((refund) => refund.status === "rejected");
      default:
        return refunds;
    }
  };

  const filteredRefunds = filterRefunds();

  const tabs = [
    { id: "all", label: "All Refunds", count: refunds.length },
    {
      id: "approved",
      label: "Approved",
      count: refunds.filter((r) => r.status === "approved").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: refunds.filter(
        (r) => r.status === "pending" || r.status === "processing"
      ).length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: refunds.filter((r) => r.status === "rejected").length,
    },
  ];
  return (
    <div className="max-w-6xl mx-auto p-6 bg-background">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Refunds</h1>
            <p className="text-muted-foreground">
              Manage your refund requests and track their status
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* Refunds List */}
      <div className="space-y-6">
        {filteredRefunds.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary mb-2">
              No refunds found
            </h3>
            <p className="text-muted-foreground">
              You don't have any refund requests in this category yet.
            </p>
          </div>
        ) : (
          filteredRefunds.map((refund) => (
            <div
              key={refund._id}
              className="bg-card border border-border rounded-lg shadow-sm"
            >
              {/* Refund Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(refund.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        Refund #{refund._id}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>Order: {refund.orderId._id}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(refund.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">
                            ${refund.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className={getStatusBadge(refund.status)}>
                    {refund.status.charAt(0).toUpperCase() +
                      refund.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Refund Details */}
              <div className="px-3 py-3">
                <div className="flex justify-between items-center  border-border">
                  <span className="text-lg font-semibold text-primary">
                    Refund Amount:
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ${refund.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RefundTab;
