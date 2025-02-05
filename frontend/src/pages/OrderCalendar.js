// src/pages/OrderCalendar.js
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
import Autocomplete from "@mui/material/Autocomplete";
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
  }, [API_URL]);

  // Compute unique options from orders.
  const userNameOptions = Array.from(new Set(orders.map((order) => order.user.name)));
  const mealPlanOptions = Array.from(
    new Set(orders.map((order) => order.subscription?.mealPlan?.name).filter((name) => !!name))
  );

  // Update filters and perform filtering.
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    const filtered = orders.filter((order) => {
      const matchUser = newFilters.userName
        ? order.user.name.toLowerCase().includes(newFilters.userName.toLowerCase())
        : true;
      const matchMeal = newFilters.mealPlan
        ? order.subscription.mealPlan?.name
          .toLowerCase()
          .includes(newFilters.mealPlan.toLowerCase())
        : true;
      const matchStatus = newFilters.status
        ? order.status === newFilters.status
        : true;
      return matchUser && matchMeal && matchStatus;
    });
    setFilteredOrders(filtered);
  };

  // Map filtered orders to FullCalendar events.
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
    setSelectedOrder(info.event.extendedProps);
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
    <Container maxWidth="xl" sx={{ py: 6, px: 3, mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Order Delivery Calendar
      </Typography>

      {/* Filters Section with Autocomplete */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Autocomplete
          options={userNameOptions}
          value={filters.userName}
          onChange={(event, value) => handleFilterChange("userName", value || "")}
          renderInput={(params) => (
            <TextField {...params} label="Search by User Name" variant="outlined" fullWidth />
          )}
          sx={{ flex: 1 }}
          freeSolo
        />
        <Autocomplete
          options={mealPlanOptions}
          value={filters.mealPlan}
          onChange={(event, value) => handleFilterChange("mealPlan", value || "")}
          renderInput={(params) => (
            <TextField {...params} label="Search by Meal Plan" variant="outlined" fullWidth />
          )}
          sx={{ flex: 1 }}
          freeSolo
        />
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          displayEmpty
          fullWidth
          sx={{ flex: 1 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="preparing">Preparing</MenuItem>
          <MenuItem value="out-for-delivery">Out for Delivery</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </Box>

      {/* Calendar Container */}
      <Box
        sx={{
          height: "80vh",
          mb: 4,
          borderRadius: "24px",
          background: "rgba(255,255,255,0.8)",
          boxShadow: "12px 12px 32px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: "1 1 auto", overflowY: "auto" }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            height="100%"
          />
        </Box>
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
