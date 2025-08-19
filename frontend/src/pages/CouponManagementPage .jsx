import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import { CustomMultiSelect } from "../components/ui/multicheckbox";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../Data";

const CouponManagementPage = () => {
  const { seller } = useSelector((state) => state.seller);
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(`${server}/coupons`, {
          withCredentials: true,
        });
        setCoupons(data.coupons);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch coupons"
        );
      }
    };

    fetchCoupons();
  }, []);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    minPrice: "",
    maxPrice: "",
    quantity: "",
    expiryDate: "",
    status: "active",
    selectedProducts: [], // <-- New field
  });
  const allproduct = seller.products;
  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code: result }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const resetForm = () => {
    setFormData({
      code: "",
      discountPercentage: "",
      minPrice: "",
      maxPrice: "",
      quantity: "",
      expiryDate: "",
      status: "active",
      selectedProducts: [], // <-- Reset selected products
    });
    setShowCreateForm(false);
    setEditingCoupon(null);
  };

  const handleCreateCoupon = async () => {
    if (
      !formData.code ||
      !formData.discountPercentage ||
      !formData.minPrice ||
      !formData.maxPrice ||
      !formData.quantity
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedProducts =
      formData.selectedProducts.length > 0
        ? formData.selectedProducts
        : seller.products.map((product) => product._id); // Assuming _id from MongoDB

    try {
      const { data } = await axios.post(
        `${server}/coupons/create`,
        {
          code: formData.code.toUpperCase(),
          discountPercentage: parseInt(formData.discountPercentage),
          minPrice: parseInt(formData.minPrice),
          maxPrice: parseInt(formData.maxPrice),
          quantity: parseInt(formData.quantity),
          expiryDate: formData.expiryDate || null,
          selectedProducts,
        },
        {
          headers: {
            Authorization: `Bearer ${seller.token}`, // if using token-based auth
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setCoupons((prev) => [data.coupon, ...prev]);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEditCoupon = async (couponId) => {
    try {
      const { data } = await axios.get(`${server}/coupons/${couponId}`, {
        withCredentials: true,
      });

      const coupon = data.coupon;
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountPercentage: coupon.discountPercentage.toString(),
        minPrice: coupon.minPrice.toString(),
        maxPrice: coupon.maxPrice.toString(),
        quantity: coupon.quantity.toString(),
        expiryDate: coupon.expiryDate?.split("T")[0] || "",
        status: coupon.status,
        selectedProducts: coupon.selectedProducts || [],
      });
      setShowCreateForm(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch coupon");
    }
  };

  const handleUpdateCoupon = async () => {
    if (
      !formData.code ||
      !formData.discountPercentage ||
      !formData.minPrice ||
      !formData.maxPrice ||
      !formData.quantity
    ) {
      toast("Please fill in all required fields");
      return;
    }

    try {
      const updatedData = {
        ...formData,
        discountPercentage: parseInt(formData.discountPercentage),
        minPrice: parseInt(formData.minPrice),
        maxPrice: parseInt(formData.maxPrice),
        quantity: parseInt(formData.quantity),
      };

      const { data } = await axios.put(
        `${server}/coupons/${editingCoupon._id}`,
        updatedData,
        { withCredentials: true }
      );

      setCoupons((prev) =>
        prev.map((c) => (c._id === data.coupon._id ? data.coupon : c))
      );
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update coupon");
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      const { data } = await axios.patch(
        `${server}/coupons/${id}/status`,
        {},
        { withCredentials: true }
      );

      setCoupons((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: data.coupon.status } : c
        )
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to toggle status");
    }
  };

  const deleteCoupon = async (id) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axios.delete(`${server}/coupons/${id}`, {
          withCredentials: true,
        });
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete coupon");
      }
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || coupon.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-full mx-auto p-6">
      <div className="bg-accent rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Coupon</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
            >
              <Plus size={20} />
              Create Coupon
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by coupon code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="p-6 bg-accent border-b border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      handleInputChange("code", e.target.value.toUpperCase())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={generateCouponCode}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    handleInputChange("discountPercentage", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                  min="1"
                  max="99"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Price *
                </label>
                <input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                  min="0"
                  placeholder="Minimum order amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Price *
                </label>
                <input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                  min="0"
                  placeholder="Maximum order amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                  min="1"
                  placeholder="Number of uses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <CustomMultiSelect
                options={allproduct}
                selected={formData.selectedProducts}
                onChange={(selected) =>
                  handleInputChange("selectedProducts", selected)
                }
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={
                  editingCoupon ? handleUpdateCoupon : handleCreateCoupon
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save size={16} />
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-accent">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-bg-accent">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-primary bg-accent/90 px-2 py-1 rounded">
                      {coupon.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coupon.discountPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${coupon.minPrice} - ${coupon.maxPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span>
                        {coupon.usedQuantity} / {coupon.quantity}
                      </span>
                      <div className="w-full bg-border rounded-full h-2 mt-1">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (coupon.usedQuantity / coupon.quantity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        coupon.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coupon.expiryDate || "No expiry"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCouponStatus(coupon._id)}
                        className={`p-2 rounded-lg ${
                          coupon.status === "active"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={
                          coupon.status === "active" ? "Deactivate" : "Activate"
                        }
                      >
                        {coupon.status === "active" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditCoupon(coupon._id)}
                        className="p-2 text-primary hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No coupons found</div>
            <p className="text-gray-400 mt-2">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first coupon to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagementPage;
