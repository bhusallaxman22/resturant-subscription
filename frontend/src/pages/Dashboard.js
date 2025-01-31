import React, { useEffect, useState } from "react";
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
  Divider,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid2";
import { showErrorToast } from "../components/ToastNotification";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import HistoryIcon from '@mui/icons-material/History';
import DetailItem from "../components/DetailItem";
import StatusChip from "../components/StatusChip";
import CardWrapper from "../components/CardWrapper";

const Dashboard = () => {
  const theme = useTheme();
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

      // Filter out canceled orders
      const activeOrders = res.data.filter((order) => order.status !== "cancelled");
      setOrders(activeOrders);
      console.log("activeOrders", activeOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" align="left" gutterBottom sx={{
        fontWeight: 700,
        color: theme.palette.text.primary,
        mb: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <LocalDiningIcon fontSize="large" />
        Dashboard
      </Typography>

      {/* Subscription Card */}
      <Box
        sx={{
          p: 5,
          mb: 6,
          background: "rgba(236, 99, 10, 0.3)",
          borderRadius: 4,
          boxShadow: 3,
          color: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalDiningIcon /> Active Subscription
        </Typography>
        {subscription ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <DetailItem label="Plan" value={subscription?.mealPlan?.name} />
              <DetailItem label="Description" value={subscription?.mealPlan?.description} />
              <DetailItem label="Price" value={`$${subscription?.mealPlan?.price.toFixed(2)}`} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem
                label="Next Delivery"
                value={new Date(subscription.nextDeliveryDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              />
              <DetailItem label="Meals per Week" value={subscription?.mealPlan?.deliveryDays?.length * subscription?.mealPlan?.meals?.length} />
              <DetailItem label="Delivery Days" value={subscription?.mealPlan?.deliveryDays?.join(", ")} />
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
            No active subscription found.
          </Alert>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Upcoming Delivery Card - Enhanced */}
        <Grid item xs={12} md={6}>
          <CardWrapper icon={<DeliveryDiningIcon />} title="Upcoming Delivery">
            {orders.length > 0 ? (
              <Box sx={{ p: 3, position: 'relative' }}>
                <Box sx={{
                  position: 'absolute',
                  top: -16,
                  right: 16,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  Next Delivery
                </Box>

                <DetailItem
                  label="SCHEDULED FOR"
                  value={new Date(orders[0].deliveryDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                  stack
                  valueStyle={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 3
                  }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{
                      backgroundColor: theme.palette.background.default,
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Total Meals
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {subscription?.mealPlan?.meals?.length}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{
                      backgroundColor: theme.palette.background.default,
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Delivery Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <StatusChip status={orders[0].status} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{
                  color: 'text.secondary',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LocalDiningIcon fontSize="small" /> Included Meals
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  '& > *': {
                    backgroundColor: theme.palette.action.hover,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem'
                  }
                }}>
                  {subscription?.mealPlan?.meals?.map((meal) => (
                    <Box key={meal._id}>{meal.name}</Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>No upcoming deliveries</Alert>
            )}
          </CardWrapper>
        </Grid>

        {/* Order History Card - Enhanced */}
        <Grid item xs={12} md={6}>
          <CardWrapper icon={<HistoryIcon />} title="Order History">
            {orders.length > 0 ? (
              <Box sx={{
                maxHeight: '560px',
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: theme.palette.action.selected,
                  borderRadius: 3
                },
              }}>
                {orders.map((order, index) => (
                  <Accordion
                    key={order._id}
                    sx={{
                      mb: 1.5,
                      boxShadow: theme.shadows[1],
                      borderRadius: '12px!important',
                      transition: 'all 0.2s ease',
                      '&:hover': { boxShadow: theme.shadows[3] },
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        pr: 2
                      }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Order #{index + 1}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(order.deliveryDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <StatusChip status={order.status} />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <DetailItem
                            label="Total Meals"
                            value={subscription?.mealPlan?.meals?.length}
                            stack
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <DetailItem
                            label="Delivery Type"
                            value="Standard"
                            stack
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            MEAL ITEMS
                          </Typography>
                          <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mt: 1
                          }}>
                            {subscription?.mealPlan?.meals?.map((meal) => (
                              <Chip
                                key={meal._id}
                                label={meal.name}
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.action.selected,
                                  borderRadius: 1
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>No order history available</Alert>
            )}
          </CardWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
