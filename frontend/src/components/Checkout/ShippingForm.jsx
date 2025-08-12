import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ShippingForm({ onSubmit }) {
  const { user } = useSelector((state) => state.user);
  const addresses = user?.addresses || [];
  const defaultAddress =
    addresses.find((addr) => addr.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?._id || ""
  );

  useEffect(() => {
    if (!defaultAddress) return;
    setSelectedAddressId(defaultAddress._id);
  }, [defaultAddress]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({});

  // 🟡 Update form when selected address changes
  useEffect(() => {
    const selected = addresses.find((a) => a._id === selectedAddressId);
    if (selected) {
      setFormData({
        name: selected.name || "",
        phone: selected.phone || "",
        address: selected.address || "",
        city: selected.city || "",
        state: selected.state || "",
        zipCode: selected.zipCode || "",
        country: selected.country || "",
      });
    }
  }, [selectedAddressId, defaultAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputClasses = (fieldName) =>
    `
      w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      ${errors[fieldName] ? "border-red-500" : "border-gray-300"}
    `.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Address Selector */}
      {addresses.length > 0 && (
        <div>
          <label className="block  text-sm font-medium text-muted-foreground mb-1">
            Select Saved Address
          </label>
          <select
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
            className="w-full px-3 py-2 border border-boder focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-md"
          >
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.label || addr.address} ({addr.city})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Shipping Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses("phone")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={inputClasses("address")}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.country}
            onChange={handleChange}
            className={inputClasses("country")}
          />
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClasses("city")}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={inputClasses("state")}
          />
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className={inputClasses("zipCode")}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}

export default ShippingForm;
