import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Container,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { showErrorToast } from "../components/ToastNotification";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
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
      showErrorToast("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Convert orders into FullCalendar events
  const events = orders.map((order) => ({
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

  // Prepare data for the chart
  const ordersPerMonth = orders.reduce((acc, order) => {
    const month = new Date(order.deliveryDate).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = orders.reduce((acc, order) => acc + order.subscription.mealPlan.price, 0);

  const chartData = {
    labels: Object.keys(ordersPerMonth),
    datasets: [
      {
        label: "Orders",
        data: Object.values(ordersPerMonth),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Grid container spacing={4}>
          {/* Total Revenue Widget */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f0f4f7",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                ${totalRevenue.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          {/* Chart of Orders Per Month */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f0f4f7",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Orders Per Month
              </Typography>
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
                backgroundColor: "#f0f4f7",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Order Calendar
              </Typography>
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "timeGridDay,timeGridWeek",
                }}
                eventClick={(info) => setSelectedOrder(info.event.extendedProps)}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Dialog for Order Details */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>User:</strong> {selectedOrder.user.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {selectedOrder.user.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Plan:</strong> {selectedOrder.mealPlan.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Delivery Date:</strong>{" "}
              {new Date(selectedOrder.start).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Meals:</strong> {selectedOrder.meals}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Status:</strong> {selectedOrder.status}
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
