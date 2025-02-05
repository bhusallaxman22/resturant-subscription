// src/pages/DashboardUnified.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Button,
  Paper,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DetailItem from "../components/atoms/DetailItem";
import StatusChip from "../components/atoms/StatusChip";
import CardWrapper from "../components/molecules/CardWrapper";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardUnified = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  // Only display 3 orders initially
  const [visibleCount, setVisibleCount] = useState(3);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSubscription();
    fetchOrders();
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscription(res.data);
    } catch (error) {
      setSubscription(null);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Exclude cancelled orders (if desired)
      const activeOrders = res.data.filter(
        (order) => order.status.toLowerCase() !== "cancelled"
      );
      setOrders(activeOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLoadMore = () => {
    // Increase visible count by 3, but do not exceed the total number of orders
    setVisibleCount((prev) => Math.min(prev + 3, orders.length));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography
        variant="h3"
        sx={{ mb: 4, fontWeight: 700, color: theme.palette.text.primary }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Subscription Section */}
        <Grid item xs={12}>
          {loadingSubscription ? (
            <Alert severity="info">Loading subscription info...</Alert>
          ) : subscription ? (
            <CardWrapper
              icon={<Box sx={{ fontSize: "2rem" }}>💳</Box>}
              title="Active Subscription"
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Plan"
                    value={subscription.mealPlan?.name || "N/A"}
                  />
                  <DetailItem
                    label="Price"
                    value={`$${subscription.mealPlan?.price.toFixed(2)}`}
                  />
                  <DetailItem
                    label="Delivery Days"
                    value={
                      subscription.mealPlan?.deliveryDays
                        ? subscription.mealPlan.deliveryDays.join(", ")
                        : "N/A"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Next Delivery"
                    value={new Date(
                      subscription.nextDeliveryDate
                    ).toLocaleDateString()}
                  />
                  <DetailItem
                    label="Meals per Week"
                    value={subscription.mealPlan?.meals?.length || "N/A"}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/subscription")}
                >
                  Manage Subscription
                </Button>
              </Box>
            </CardWrapper>
          ) : (
            <Alert severity="warning">
              You have no active subscription.{" "}
              <Button variant="text" onClick={() => navigate("/subscription")}>
                Get started
              </Button>
            </Alert>
          )}
        </Grid>

        {/* Orders Section */}
        <Grid item xs={12}>
          <CardWrapper
            icon={<Box sx={{ fontSize: "2rem" }}>📦</Box>}
            title="Your Orders"
          >
            {loadingOrders ? (
              <Alert severity="info">Loading orders...</Alert>
            ) : orders.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {orders.slice(0, visibleCount).map((order) => (
                    <Grid item xs={12} md={4} key={order._id}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.8)",
                          border: `1px solid rgba(255,255,255,0.5)`,
                          backdropFilter: "blur(8px)",
                          animation: `${fadeInUp} 0.5s ease-out`,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {order.subscription.mealPlan?.name || "Meal Plan"}
                        </Typography>
                        <Typography variant="body2">
                          Delivery:{" "}
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <StatusChip status={order.status} />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                {visibleCount < orders.length && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button variant="outlined" onClick={handleLoadMore}>
                      Load More
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Alert severity="info">No orders found.</Alert>
            )}
          </CardWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardUnified;
