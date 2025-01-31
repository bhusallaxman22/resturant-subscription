import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Bar } from "react-chartjs-2";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { showErrorToast, showSuccessToast } from "../components/ToastNotification";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
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
      showErrorToast("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Orders by Month Data
  const ordersPerMonth = orders.reduce((acc, order) => {
    const month = new Date(order.deliveryDate).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const revenuePerMonth = orders.reduce((acc, order) => {
    const month = new Date(order.deliveryDate).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + order.subscription.mealPlan.price;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(ordersPerMonth),
    datasets: [
      {
        label: "Orders",
        data: Object.values(ordersPerMonth),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Revenue ($)",
        data: Object.values(revenuePerMonth),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  // Calendar Events
  const events = orders.map((order) => ({
    id: order._id,
    title: `${order.user.name} - ${order.subscription.mealPlan.name}`,
    start: new Date(order.deliveryDate).toISOString(),
    color: order.status === "cancelled" ? "lightgray" : "teal",
    textColor: order.status === "cancelled" ? "darkgray" : "white",
    extendedProps: {
      user: order.user,
      mealPlan: order.subscription.mealPlan,
      status: order.status,
      meals: order.subscription.mealPlan.meals.map((meal) => meal.name).join(", "),
    },
  }));

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Grid container spacing={4}>
          {/* Revenue and Orders */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4" color="primary">
                ${Object.values(revenuePerMonth).reduce((a, b) => a + b, 0).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4" color="primary">
                {orders.length}
              </Typography>
            </Box>
          </Grid>

          {/* Orders and Revenue Chart */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h6">Orders & Revenue Per Month</Typography>
              <Bar data={chartData} />
            </Box>
          </Grid>

          {/* Order Calendar */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h6">Order Calendar</Typography>
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "timeGridDay,timeGridWeek",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Dialog for Order Details */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>User:</strong> {selectedOrder.user.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {selectedOrder.user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Plan:</strong> {selectedOrder.mealPlan.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong> {selectedOrder.status}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Meals:</strong> {selectedOrder.meals}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedOrder(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AdminDashboard;
