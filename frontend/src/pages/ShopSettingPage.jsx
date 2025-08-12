import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../Data";
import { useSelector } from "react-redux";

function ShopSettings() {
  const [shopData, setShopData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    setShopData(seller);
  }, [seller]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    const formData = new FormData();
    for (const key in shopData) {
      if (key !== "logo") {
        formData.append(key, shopData[key]);
      }
    }
    try {
      const res = await axios.put(`${server}/shops/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        setSuccessMsg("Shop updated successfully");
        setShopData(res.data.shop);
        setLogoFile(null);
      } else {
        setError(res.data.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-background rounded-lg shadow-lg border border-border">
      <h2 className="text-3xl font-extrabold text-primary mb-8">
        Shop Settings
      </h2>

      {error && (
        <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
          {error}
        </p>
      )}
      {successMsg && (
        <p className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-300">
          {successMsg}
        </p>
      )}

      {loading ? (
        <p className="text-center text-secondary font-semibold">Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          <div>
            <label className="block mb-1 font-semibold text-foreground">
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              value={shopData.shopName || ""}
              onChange={handleChange}
              required
              className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-foreground">
              Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={shopData.ownerName || ""}
              onChange={handleChange}
              required
              className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-foreground">
              Email (readonly)
            </label>
            <input
              type="email"
              name="email"
              value={shopData.email || ""}
              readOnly
              disabled
              className="w-full border border-border rounded-md p-3 bg-muted cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-foreground">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={shopData.phone || ""}
              onChange={handleChange}
              required
              className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-foreground">
              Address
            </label>
            <textarea
              name="address"
              value={shopData.address || ""}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 font-semibold text-foreground">
                City
              </label>
              <input
                type="text"
                name="city"
                value={shopData.city || ""}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-foreground">
                State
              </label>
              <input
                type="text"
                name="state"
                value={shopData.state || ""}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-foreground">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={shopData.zipCode || ""}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-foreground">
              Description
            </label>
            <textarea
              name="description"
              value={shopData.description || ""}
              onChange={handleChange}
              maxLength={1000}
              rows={6}
              className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ShopSettings;
