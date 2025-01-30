import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid2";
import { showErrorToast } from "../components/ToastNotification";

const Dashboard = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUserSubscription();
    fetchUserOrders();
  }, []);

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setSubscription(res.data);
      }
    } catch (error) {
      showErrorToast("Error fetching subscription.");
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Welcome to Your Dashboard
      </Typography>

      {/* Highlighted Subscription Section */}
      <Box
        sx={{
          p: 4,
          mb: 5,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Your Subscription Plan
        </Typography>
        {subscription ? (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Plan:</strong> {subscription?.mealPlan.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Description:</strong> {subscription?.mealPlan.description}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Price:</strong> ${subscription?.mealPlan.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Next Delivery:</strong>{" "}
              {new Date(subscription.nextDeliveryDate).toDateString()}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Meals per week:</strong> {subscription?.mealPlan.mealsPerWeek}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Delivery Days:</strong>{" "}
              {subscription?.mealPlan.deliveryDays?.join(", ")}
            </Typography>
          </Box>
        ) : (
          <Alert severity="info">No active subscription found.</Alert>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Upcoming Delivery Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Upcoming Delivery
            </Typography>
            {orders.length > 0 ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Date:</strong>{" "}
                  {new Date(orders[0].deliveryDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Meals:</strong>{" "}
                  {orders[0].meals.map((meal) => meal.name).join(", ")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Status:</strong>{" "}
                  <Chip
                    label={orders[0].status}
                    color={orders[0].status === "Delivered" ? "success" : "warning"}
                  />
                </Typography>
              </Box>
            ) : (
              <Alert severity="info">No upcoming deliveries.</Alert>
            )}
          </Box>
        </Grid>

        {/* Order History Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Order History
            </Typography>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <Accordion key={order._id} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      Order #{index + 1} -{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}{" "}
                      <Chip
                        label={order.status}
                        color={order.status === "Delivered" ? "success" : "warning"}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Meals:</strong>{" "}
                      {order.meals.map((meal) => meal.name).join(", ")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Total Meals:</strong> {order.meals.length}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Alert severity="info">No past orders found.</Alert>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
