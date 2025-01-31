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
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import CardWrapper from "../components/CardWrapper";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For dialog
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
    acc[month] = (acc[month] || 0) + order.subscription.mealPlan?.price;
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
    setSelectedOrder(info.event.extendedProps); // Open the dialog with order details
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
      setSelectedOrder(null); // Close the dialog
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6, px: isMobile ? 2 : 4 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "center",
            color: theme.palette.text.primary,
          }}
        >
          <TrendingUp fontSize="large" />
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
          <CircularProgress size={80} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Order Calendar */}
          <Grid item xs={12}>
            <CardWrapper
              icon={<CalendarToday />}
              title="Delivery Schedule"
              subtitle="Upcoming orders"
            >
              <Box sx={{ height: 500 }}>
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
              <Box sx={{ height: 400 }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
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


const StatCard = ({ icon, title, value, color }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      p: 4,
      borderRadius: 4,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
      }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        mb: 2
      }}>
        <Box sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { color } })}
        </Box>
        <Typography variant="h6" sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500
        }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{
        fontWeight: 700,
        color: theme.palette.text.primary,
        textAlign: 'right'
      }}>
        {value}
      </Typography>
    </Box>
  );
};

export default AdminDashboard;
