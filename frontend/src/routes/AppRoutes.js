import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import OrderCalendar from "../pages/OrderCalendar";
import SubscriptionPage from "../pages/SubscriptionPage";
import AdminMealPlans from "../pages/AdminMealPlans";
import CheckoutPage from "../pages/CheckoutPage";
import UserOrders from "../pages/UserOrders";
import AdminOrders from "../pages/AdminOrders";

const AppRoutes = () => (
  <Routes>
    {/* Public Pages */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Customer Pages (Protected) */}
    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
    <Route path="/subscription" element={<PrivateRoute element={<SubscriptionPage />} />} />
    <Route path="/checkout" element={<PrivateRoute element={<CheckoutPage />} />} />
    <Route path="/orders" element={<PrivateRoute element={<UserOrders />} />} />

    {/* Admin Pages (Admin-Only Protected) */}
    <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} adminOnly />} />
    <Route path="/admin/calendar" element={<PrivateRoute element={<OrderCalendar />} adminOnly />} />
    <Route path="/admin/meal-plans" element={<PrivateRoute element={<AdminMealPlans />} adminOnly />} />
    <Route path="/admin/orders" element={<PrivateRoute element={<AdminOrders />} adminOnly />} />

    {/* Fallback Route */}
    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
  </Routes>
);

export default AppRoutes;
