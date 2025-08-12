import React, { useState, useEffect } from "react";
import { Store, Upload, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShop, resetShopCreation } from "../redux/actions/seller"; // <-- your action creators

function ShopCreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { seller } = useSelector((state) => state.seller);
  const { shopCreationLoading, shopCreationSuccess, shopCreationError } =
    useSelector((state) => state.seller);

  const [createFormData, setCreateFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
    logo: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (seller) {
      navigate("/shop/dashboard");
    }
  }, [seller, navigate]);

  useEffect(() => {
    if (shopCreationSuccess) {
      alert("Shop registered successfully! Please verify via email.");
      dispatch(resetShopCreation()); // reset state after success
      // Optionally clear form or navigate
      // navigate('/shop/login'); // or wherever you want
    }
  }, [shopCreationSuccess, dispatch]);

  const handleCreateInputChange = (field, value) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleCreateInputChange("logo", file);
    }
  };

  const validateCreateForm = () => {
    const newErrors = {};

    if (!createFormData.shopName.trim())
      newErrors.shopName = "Shop name is required";
    if (!createFormData.ownerName.trim())
      newErrors.ownerName = "Owner name is required";
    if (!createFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(createFormData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!createFormData.password) {
      newErrors.password = "Password is required";
    } else if (createFormData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (createFormData.password !== createFormData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!createFormData.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!createFormData.address.trim())
      newErrors.address = "Address is required";
    if (!createFormData.city.trim()) newErrors.city = "City is required";
    if (!createFormData.zipCode.trim())
      newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateShop = () => {
    if (!validateCreateForm()) return;

    const formData = new FormData();
    Object.entries(createFormData).forEach(([key, value]) => {
      if (key === "logo") {
        if (value && typeof value === "object") {
          formData.append("logo", value); // append File
        }
      } else {
        formData.append(key, value);
      }
    });

    dispatch(createShop(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Shop
            </h1>
            <p className="text-gray-600 mt-2">
              Start your online business journey today
            </p>
          </div>

          {/* Show API error from Redux */}
          {shopCreationError && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {shopCreationError}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    value={createFormData.shopName}
                    onChange={(e) =>
                      handleCreateInputChange("shopName", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                      errors.shopName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="My Awesome Shop"
                  />
                  {errors.shopName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shopName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    value={createFormData.ownerName}
                    onChange={(e) =>
                      handleCreateInputChange("ownerName", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                      errors.ownerName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.ownerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) =>
                      handleCreateInputChange("email", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={createFormData.phone}
                    onChange={(e) =>
                      handleCreateInputChange("phone", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={createFormData.password}
                    onChange={(e) =>
                      handleCreateInputChange("password", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="At least 6 characters"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={createFormData.confirmPassword}
                    onChange={(e) =>
                      handleCreateInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Repeat password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shop Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={createFormData.address}
                    onChange={(e) =>
                      handleCreateInputChange("address", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                      errors.address ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={createFormData.city}
                      onChange={(e) =>
                        handleCreateInputChange("city", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                        errors.city ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={createFormData.state}
                      onChange={(e) =>
                        handleCreateInputChange("state", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none "
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={createFormData.zipCode}
                      onChange={(e) =>
                        handleCreateInputChange("zipCode", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                        errors.zipCode ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shop Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Description
                  </label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) =>
                      handleCreateInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none "
                    placeholder="Tell customers about your shop..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {createFormData.logo ? (
                      <img
                        src={URL.createObjectURL(createFormData.logo)}
                        alt="Shop Logo"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Choose File
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleCreateShop}
                disabled={shopCreationLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {shopCreationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-border"></div>
                    <span>Creating Shop...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Create My Shop</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have a shop?{" "}
                <a
                  href="/shop/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopCreatePage;
