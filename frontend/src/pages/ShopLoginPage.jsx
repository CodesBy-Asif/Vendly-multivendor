import React, { useState, useEffect } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../Data";

function ShopLoginPage() {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (seller) {
      navigate("/shop/dashboard");
    }
  }, [seller]);

  const handleInputChange = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!loginForm.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    setIsSubmitting(true);

    try {
      dispatch({ type: "LoadSellerRequest" }); // start loading

      const response = await axios.post(`${server}/shops/login`, loginForm, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const { shop } = response.data;
        dispatch({
          type: "LoadSellerSuccess",
          payload: shop,
        });

        alert("Login successful!");
        navigate(`/shop/dashboard`);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrors({
        api: error.response?.data?.message || "Login failed. Please try again.",
      });

      dispatch({
        type: "LoadSellerFail",
        payload: error.response?.data?.message || "Login failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Shop Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Access your seller dashboard
        </p>

        {errors.api && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
            {errors.api}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="you@example.com"
              />
              <Mail
                className="absolute right-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Your password"
              />
              <Lock
                className="absolute right-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have a shop?{" "}
            <a
              href="/shop/create"
              className="text-primary font-semibold hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShopLoginPage;
