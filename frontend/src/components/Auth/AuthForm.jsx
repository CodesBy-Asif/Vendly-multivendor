import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import registerUser from "../../service/registerUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { server } from "../../Data";

const AuthForm = (prop) => {
  const [showRegister, setShowRegister] = useState(prop.showRegisterprop);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlelogin = async (e) => {
    e.preventDefault();

    if (!Email || !Password) {
      return toast.error("Please enter email and password.");
    }
    const isValidEmail = (email) => {
      const strictPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return strictPattern.test(email);
    };

    if (!isValidEmail(Email)) {
      return toast.error("Please enter a valid email.");
    }
    dispatch({ type: "LoadUserRequest" });

    try {
      const res = await axios.post(
        `${server}/user/login`,
        { email: Email, password: Password },
        {
          withCredentials: true,
        }
      );

      dispatch({ type: "LoadUserSuccess", payload: res.data.user });
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      dispatch({ type: "LoadUserFail", payload: errorMsg });
      toast.error(errorMsg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !Email || !Password) {
      return toast.error("Please fill in all fields.");
    }

    const isValidEmail = (email) => {
      const strictPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return strictPattern.test(email);
    };

    if (!isValidEmail(Email)) {
      return toast.error("Please enter a valid email.");
    }

    if (Password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const data = await registerUser(name, Email, Password);
      if (data?.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Registration failed";
      if (/User validation failed/i.test(errorMessage)) {
        toast.error("Please provide your name, email, and password.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`md:max-w-3xl max-w-md w-[95%] bg-gray-900 text-white min-h-[450px] shadow-2xl m-auto flex md:flex-row flex-col gap-2 rounded-lg overflow-hidden ${
        !showRegister ? "flex-col-reverse" : ""
      }`}
    >
      {/* Left Section */}
      <AnimatePresence mode="wait">
        {showRegister ? (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="md:w-1/2 bg-white flex items-center justify-center"
          >
            <div className="p-8 rounded-xl w-full max-w-md text-black">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Create a New Account
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="you@example.com"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mb-6">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full outline bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
                onClick={handleRegister}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col py-6 justify-center px-8 md:w-1/2 space-y-4"
          >
            <h1 className="font-bold text-2xl">Don’t have an account?</h1>
            <p className="text-gray-300">
              Join the marketplace — where vinyl meets value and discovery.
            </p>
            <button
              onClick={() => {
                setShowRegister(true);
                setShowPassword(false);
              }}
              className="bg-white text-gray-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              Sign up
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Section */}
      <AnimatePresence mode="wait">
        {showRegister ? (
          <motion.div
            key="register-text"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col py-6 justify-center px-8 md:w-1/2 space-y-4"
          >
            <h1 className="font-bold text-2xl">Already have an account?</h1>
            <p className="text-gray-300">
              Log in to manage your profile, view orders, and shop easily.
            </p>
            <button
              onClick={() => {
                setShowRegister(false);
                setShowPassword(false);
              }}
              className="bg-white text-gray-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              Login
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="md:w-1/2 bg-white flex items-center justify-center"
          >
            <div className="p-8 rounded-xl w-full max-w-md text-black">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Login to Your Account
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="you@example.com"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative mb-6">
                <div className="flex justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a href="/forgotpassword" className="hover:underline text-xs">
                    Forgot password?
                  </a>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                  placeholder="••••••••"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-primary outline hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md transition duration-200"
                onClick={handlelogin}
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
