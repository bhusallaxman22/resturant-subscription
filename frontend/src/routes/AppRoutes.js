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
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import NotFoundPage from "../pages/NotFoundPage";
import OnboardingWizard from "../pages/OnboardingWizard";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes = () => (
  <Routes>
    {/* Public Pages */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/contact-us" element={<ContactUs />} />


    {/* Customer Pages (Protected) */}
    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
    <Route path="/subscription" element={<PrivateRoute element={<SubscriptionPage />} />} />
    <Route path="/checkout" element={<PrivateRoute element={<CheckoutPage />} />} />
    <Route path="/orders" element={<PrivateRoute element={<UserOrders />} />} />
    <Route path="/onboarding" element={<PrivateRoute element={<OnboardingWizard />} />} />
    <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />


    {/* Admin Pages (Admin-Only Protected) */}
    <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} adminOnly />} />
    <Route path="/admin/calendar" element={<PrivateRoute element={<OrderCalendar />} adminOnly />} />
    <Route path="/admin/meal-plans" element={<PrivateRoute element={<AdminMealPlans />} adminOnly />} />
    <Route path="/admin/orders" element={<PrivateRoute element={<AdminOrders />} adminOnly />} />

    {/* Fallback Route */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
