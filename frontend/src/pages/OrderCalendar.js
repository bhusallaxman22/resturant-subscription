// Path: frontend/src/pages/OrderCalendar.js
import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { showErrorToast, showSuccessToast } from "../components/atoms/ToastNotifications";
import OrderDetailsDialog from "../components/organisms/OrderDetailsDialog";

const OrderCalendar = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [filters, setFilters] = useState({
    userName: "",
    mealPlan: "",
    status: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/orders/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (error) {
        showErrorToast("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const events = filteredOrders?.map((order) => ({
    id: order._id,
    title: `${order.user.name} - ${order.subscription?.mealPlan?.name || "Meal Plan"}`,
    date: new Date(order.deliveryDate).toISOString().split("T")[0],
    color:
      order.status === "pending"
        ? "orange"
        : order.status === "preparing"
          ? "blue"
          : order.status === "out-for-delivery"
            ? "teal"
            : order.status === "completed"
              ? "green"
              : "gray",
    extendedProps: order,
  }));

  const handleEventClick = (info) => {
    const order = info.event.extendedProps;
    setSelectedOrder(order);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    const filtered = orders.filter((order) => {
      return (
        (filters.userName
          ? order.user.name.toLowerCase().includes(filters.userName.toLowerCase())
          : true) &&
        (filters.mealPlan
          ? order.subscription.mealPlan?.name
            .toLowerCase()
            .includes(filters.mealPlan.toLowerCase())
          : true) &&
        (filters.status ? order.status === filters.status : true)
      );
    });
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccessToast("Order status updated successfully.");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
      setSelectedOrder(null);
    } catch (error) {
      showErrorToast("Error updating order status.");
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6, px: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Delivery Calendar
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search by User Name"
          value={filters.userName}
          onChange={(e) => handleFilterChange("userName", e.target.value)}
          fullWidth
        />
        <TextField
          label="Search by Meal Plan"
          value={filters.mealPlan}
          onChange={(e) => handleFilterChange("mealPlan", e.target.value)}
          fullWidth
        />
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="preparing">Preparing</MenuItem>
          <MenuItem value="out-for-delivery">Out for Delivery</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </Box>

      {/* Calendar */}
      <Box sx={{ height: "80vh" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
        />
      </Box>
      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateOrderStatus}
      />
    </Container>
  );
};

export default OrderCalendar;
