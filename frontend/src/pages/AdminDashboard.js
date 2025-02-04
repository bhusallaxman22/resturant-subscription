// Path: frontend/src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Bar } from "react-chartjs-2";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  MonetizationOn,
  ShoppingBasket,
  CalendarToday,
  TrendingUp,
} from "@mui/icons-material";
import StatCard from "../components/molecules/StatCard";
import { keyframes } from "@emotion/react";
import CardWrapper from "../components/molecules/CardWrapper";
import OrderDetailsDialog from "../components/organisms/OrderDetailsDialog";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Fade-in and slide-up animation
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  const events = orders.map((order) => ({
    id: order._id,
    title: `${order.user.name} - ${order.subscription.mealPlan?.name}`,
    start: new Date(order.deliveryDate).toISOString(),
    color: order.status === "cancelled" ? "lightgray" : "teal",
    textColor: order.status === "cancelled" ? "darkgray" : "white",
    extendedProps: order,
  }));

  const chartData = {
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
      {
        label: "Revenue ($)",
        data: Object.values(revenuePerMonth),
        backgroundColor: theme.palette.secondary.light,
        borderColor: theme.palette.secondary.main,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

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
    <Container
      maxWidth="xl"
      sx={{
        py: 6,
        px: isMobile ? 2 : 4,
        background: "linear-gradient(145deg, #F5F6FF, #FFFFFF)",
        minHeight: "100vh",
        animation: `${fadeInUp} 0.8s ease-out`,
      }}
    >
      {/* Dashboard Header */}
      <Box
        sx={{
          mb: 6,
          textAlign: "center",
          p: 4,
          borderRadius: "40px",
          background: "rgba(255, 255, 255, 0.8)",
          boxShadow:
            "12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(12px)",
          animation: `${fadeInUp} 0.8s ease-out`,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "center",
            color: theme.palette.text.primary,
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <TrendingUp
            fontSize="large"
            sx={{
              color: theme.palette.primary.main,
              filter: "drop-shadow(2px 2px 4px rgba(124, 131, 253, 0.2))",
            }}
          />
          Admin Dashboard
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress
            size={80}
            thickness={4}
            sx={{ color: theme.palette.primary.main }}
          />
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ animation: `${fadeInUp} 0.8s ease-out` }}>
          {/* Order Calendar */}
          <Grid item xs={12}>
            <CardWrapper
              icon={<CalendarToday />}
              title="Delivery Schedule"
              subtitle="Upcoming orders"
            >
              <Box
                sx={{
                  height: 500,
                  borderRadius: "24px",
                  overflow: "hidden",
                  "& .fc": {
                    border: "none",
                    borderRadius: "24px",
                    overflow: "hidden",
                  },
                  "& .fc-header-toolbar": {
                    backgroundColor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "24px 24px 0 0",
                    padding: "16px",
                    margin: 0,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  },
                }}
              >
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
                  events={events}
                  eventClick={handleEventClick}
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "timeGridDay,timeGridWeek",
                  }}
                  height="100%"
                />
              </Box>
            </CardWrapper>
          </Grid>

          {/* Summary Cards */}
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

          {/* Orders & Revenue Chart */}
          <Grid item xs={12} lg={8}>
            <CardWrapper
              icon={<TrendingUp />}
              title="Monthly Performance"
              subtitle="Orders vs Revenue"
            >
              <Box
                sx={{
                  height: 400,
                  "& canvas": {
                    borderRadius: "24px",
                  },
                }}
              >
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                      duration: 1500,
                      easing: "easeInOutQuart",
                    },
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          color: theme.palette.text.primary,
                          font: { weight: 600 },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: { color: "rgba(0,0,0,0.05)" },
                        ticks: { color: theme.palette.text.primary },
                      },
                      y: {
                        grid: { color: "rgba(0,0,0,0.05)" },
                        ticks: { color: theme.palette.text.primary },
                      },
                    },
                  }}
                />
              </Box>
            </CardWrapper>
          </Grid>
        </Grid>
      )}

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

export default AdminDashboard;
