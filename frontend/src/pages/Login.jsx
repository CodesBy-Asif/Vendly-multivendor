import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Auth/AuthForm";
const Login = (prop) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-w-screen min-h-screen flex items-center bg-background py-8">
      <AuthForm showRegisterprop={!!prop.register} />
    </div>
  );
};

export default Login;
