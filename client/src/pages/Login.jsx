import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../configs/api";
import { login } from "../app/features/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = location.pathname === "/register";

  const { user } = useSelector((state) => state.auth);
  React.useEffect(() => {
  if (user) {
    navigate("/app");
  }
}, [user, navigate]);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isRegister ? "register" : "login";

      const { data } = await api.post(`/api/users/${endpoint}`, formData);

      dispatch(login(data));
      localStorage.setItem("token", data.token);

      navigate("/app");
    } catch (error) {
      console.log("Auth error:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { data } = await api.post("/api/users/google-login", {
        token: credentialResponse.credential,
      });

      // Save token
      localStorage.setItem("token", data.token);

      // Update redux state
      dispatch(login(data));

      // Redirect to dashboard
      navigate("/app");

    } catch (error) {
      console.log("Google auth error:", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {isRegister ? "Sign up" : "Login"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {isRegister ? "register" : "login"} to continue
        </p>

        {isRegister && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0 w-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0 w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
        >
          {isRegister ? "Sign up" : "Login"}
        </button>

        {/* Google Login Button (Only on Login page) */}
        {!isRegister && (
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />
          </div>
        )}

        <p className="text-gray-500 text-sm mt-3 mb-11">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => navigate(isRegister ? "/login" : "/register")}
            className="text-green-500 hover:underline cursor-pointer"
          >
            click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login; 