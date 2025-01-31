import { useEffect, useState } from "react";
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
  Stack,
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  const events = orders.map((order) => ({
    id: order._id,
    title: `${order.user.name} - ${order.subscription.mealPlan.name}`,
    start: new Date(order.deliveryDate).toISOString(),
    color: order.status === "cancelled" ? "lightgray" : "teal",
    textColor: order.status === "cancelled" ? "darkgray" : "white",
  }));

  return (
    <Container sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Admin Dashboard
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          {isMobile ? (
            // Mobile Layout (Stacked)
            <Stack spacing={3}>
              {/* Total Revenue */}
              <Box
                sx={{
                  p: 2,
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

              {/* Total Orders */}
              <Box
                sx={{
                  p: 2,
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

              {/* Orders & Revenue Chart */}
              <Box
                sx={{
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                  Orders & Revenue Per Month
                </Typography>
                <Box sx={{ width: "100%", minWidth: "300px" }}>
                  <Bar data={chartData} />
                </Box>
              </Box>

              {/* Order Calendar */}
              <Box
                sx={{
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                  Order Calendar
                </Typography>
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridDay"
                  events={events}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridDay",
                  }}
                  height={350}
                />
              </Box>
            </Stack>
          ) : (
            // Desktop Layout (Grid)
            <Grid container spacing={3}>
              {/* Total Revenue */}
              <Grid item xs={12} sm={6} md={4}>
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

              {/* Total Orders */}
              <Grid item xs={12} sm={6} md={4}>
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

              {/* Orders & Revenue Chart */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                    Orders & Revenue Per Month
                  </Typography>
                  <Box sx={{ width: "100%" }}>
                    <Bar data={chartData} />
                  </Box>
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
                  <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                    Order Calendar
                  </Typography>
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "timeGridWeek",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
