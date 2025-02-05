// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  MonetizationOn,
  ShoppingBasket,
  CalendarToday,
  TrendingUp,
} from "@mui/icons-material";
import StatCard from "../components/molecules/StatCard";
import CardWrapper from "../components/molecules/CardWrapper";
import OrderDetailsDialog from "../components/organisms/OrderDetailsDialog";

// Register all necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Compute monthly stats for orders and revenue.
  const ordersPerMonth = orders.reduce((acc, order) => {
    const month = new Date(order.deliveryDate).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const revenuePerMonth = orders.reduce((acc, order) => {
    const month = new Date(order.deliveryDate).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + (order.subscription?.mealPlan?.price || 0);
    return acc;
  }, {});

  // Prepare chart data for orders (Bar chart).
  const ordersChartData = {
    labels: Object.keys(ordersPerMonth),
    datasets: [
      {
        label: "Orders",
        data: Object.values(ordersPerMonth),
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Prepare chart data for revenue (Line chart).
  const revenueChartData = {
    labels: Object.keys(revenuePerMonth),
    datasets: [
      {
        label: "Revenue ($)",
        data: Object.values(revenuePerMonth),
        backgroundColor: theme.palette.secondary.light,
        borderColor: theme.palette.secondary.main,
        borderWidth: 2,
        fill: false,
        tension: 0.4, // Smooth curves
      },
    ],
  };

  // Prepare calendar events.
  const events = orders.map((order) => ({
    id: order._id,
    title: `${order.user.name} - ${order.subscription.mealPlan?.name}`,
    start: new Date(order.deliveryDate).toISOString(),
    color: order.status === "cancelled" ? "lightgray" : "teal",
    textColor: order.status === "cancelled" ? "darkgray" : "white",
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
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 6, mt: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, textAlign: "center", mb: 6 }}>
          Admin Dashboard
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size={80} thickness={4} sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Stat Cards */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<MonetizationOn fontSize="large" />}
                title="Total Revenue"
                value={`$${Object.values(revenuePerMonth).reduce((a, b) => a + b, 0).toFixed(2)}`}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<ShoppingBasket fontSize="large" />}
                title="Total Orders"
                value={orders.length}
                color={theme.palette.secondary.main}
              />
            </Grid>

            {/* Orders Bar Chart */}
            <Grid item xs={12} md={6}>
              <CardWrapper icon={<TrendingUp />} title="Orders Overview" subtitle="Monthly orders">
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={ordersChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                          labels: { color: theme.palette.text.primary, font: { weight: 600 } },
                        },
                      },
                      scales: {
                        x: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: theme.palette.text.primary } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: theme.palette.text.primary } },
                      },
                    }}
                  />
                </Box>
              </CardWrapper>
            </Grid>

            {/* Revenue Line Chart */}
            <Grid item xs={12} md={6}>
              <CardWrapper icon={<TrendingUp />} title="Revenue Trends" subtitle="Monthly revenue">
                <Box sx={{ height: 300 }}>
                  <Line
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                          labels: { color: theme.palette.text.primary, font: { weight: 600 } },
                        },
                      },
                      scales: {
                        x: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: theme.palette.text.primary } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: theme.palette.text.primary } },
                      },
                    }}
                  />
                </Box>
              </CardWrapper>
            </Grid>

            {/* Calendar */}
            <Grid item xs={12}>
              <CardWrapper icon={<CalendarToday />} title="Delivery Schedule">
                <Box
                  sx={{
                    maxHeight: 600,
                    overflowY: "auto",
                    "& .fc": {
                      border: "none",
                      borderRadius: "24px",
                      overflow: "hidden",
                    },
                    "& .fc-header-toolbar": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "24px 24px 0 0",
                      padding: "8px",
                      borderBottom: "1px solid rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    eventClick={handleEventClick}
                    headerToolbar={{
                      left: "prev,next",
                      center: "title",
                      right: "timeGridDay,timeGridWeek",
                    }}
                  />
                </Box>
              </CardWrapper>
            </Grid>
          </Grid>
        )}
        <OrderDetailsDialog
          open={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      </Container>
    </Box>
  );
};

export default AdminDashboard;
