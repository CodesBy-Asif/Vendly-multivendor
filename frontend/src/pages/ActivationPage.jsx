import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../Data";

const ActivationPage = () => {
  const { token, type } = useParams(); // get token and type (user/shop)
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");
  const [success, setSuccess] = useState(null);
  const calledOnce = useRef(false);

  useEffect(() => {
    if (!token || !type || calledOnce.current) return;

    const verify = async () => {
      try {
        calledOnce.current = true;
        const endpoint =
          type === "shop"
            ? `${server}/shops/activate`
            : `${server}/user/activate`;

        const res = await axios.post(endpoint, { token });
        setMessage(res.data.message);
        setSuccess(true);

        setTimeout(() => {
          navigate(type === "shop" ? "/shop/login" : "/login");
        }, 3000);
      } catch (error) {
        console.error(error);
        setMessage(
          error?.response?.data?.message || "Activation failed. Try again."
        );
        setSuccess(false);
      }
    };

    verify();
  }, [token, type, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          {success === null ? "Please wait..." : success ? "Success!" : "Error"}
        </h1>
        <p className={`text-${success ? "green" : "red"}-600 font-medium`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default ActivationPage;
