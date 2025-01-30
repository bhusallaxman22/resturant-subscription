import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../components/ToastNotification";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  console.log(API_URL);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token, clearing session...");
        logout(); // Clear session if token is invalid
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setUser(jwtDecode(res.data.token));

      // Redirect based on role
      res.data.user.role === "admin" ? navigate("/admin") : navigate("/dashboard");
      showSuccessToast("Login successful!");
    } catch (error) {
      showErrorToast(error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(jwtDecode(res.data.token));
      navigate("/dashboard");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    showSuccessToast("Logout successful!");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
