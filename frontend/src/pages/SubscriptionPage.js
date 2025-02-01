import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../components/CardWrapper";
import DetailItem from "../components/DetailItem";
import StatusChip from "../components/StatusChip";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SubscriptionIcon from '@mui/icons-material/CardMembership';

const SubscriptionPage = () => {
  const theme = useTheme();
  const [mealPlans, setMealPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchMealPlans(), fetchUserSubscription()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/plans`);
      setMealPlans(res.data);
    } catch (error) {
      showErrorToast("Error fetching meal plans.");
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        setSubscription(res.data);
      }
    } catch (error) {
      setSubscription(null);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccessToast("Subscription canceled.");
      fetchUserSubscription();
    } catch (error) {
      showErrorToast("Error canceling subscription.");
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{
        mb: 8,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <SubscriptionIcon fontSize="large" />
        Meal Plan Subscription
      </Typography>

      {subscription && (
        <CardWrapper
          icon={<LocalDiningIcon />}
          title="Active Subscription"
        >
          <Grid container spacing={4} sx={{ p: 3 }}>
            <Grid item xs={12} md={6}>
              <DetailItem label="Plan Name" value={subscription.mealPlan?.name} />
              <DetailItem
                label="Description"
                value={subscription.mealPlan?.description}
                stack
              />
              <DetailItem
                label="Price"
                value={`$${subscription.mealPlan?.price.toFixed(2)}`}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem
                label="Meals Per Week"
                value={subscription.mealPlan?.mealsPerWeek}
              />
              <DetailItem
                label="Delivery Days"
                value={subscription.mealPlan?.deliveryDays.join(", ")}
                stack
              />
              <Box sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelSubscription}
                  sx={{
                    px: 4,
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                      color: theme.palette.error.contrastText
                    }
                  }}
                >
                  Cancel Subscription
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardWrapper>
      )}

      <Typography variant="h4" sx={{
        mb: 6,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <RestaurantMenuIcon />
        Available Meal Plans
      </Typography>

      <Grid container spacing={4}>
        {mealPlans?.map((plan) => (
          <Grid item xs={12} md={4} key={plan._id}>
            <CardWrapper
              sx={{
                height: '100%',
                border: subscription?.mealPlan?._id === plan._id
                  ? `2px solid ${theme.palette.primary.main}`
                  : null,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
              icon={<LocalDiningIcon />}
              title={plan.name}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {plan.name}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={`$${plan.price.toFixed(2)}/week`}
                    color="primary"
                    sx={{
                      px: 2,
                      py: 1,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText
                    }}
                  />
                </Box>

                <DetailItem
                  label="Description"
                  value={plan.description}
                  stack
                  valueStyle={{ color: theme.palette.text.secondary }}
                />

                <Grid container spacing={1} sx={{ my: 2 }}>
                  <Grid item xs={6}>
                    <DetailItem
                      label="Meals/Week"
                      value={plan.mealsPerWeek}
                      stack
                      valueStyle={{ fontWeight: 600 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DetailItem
                      label="Delivery Days"
                      value={plan.deliveryDays.join(", ")}
                      stack
                      valueStyle={{ fontWeight: 600 }}
                    />
                  </Grid>
                </Grid>

                {subscription?.mealPlan?._id === plan._id ? (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <StatusChip
                      status="Active"
                      label="Current Plan"
                      sx={{ fontSize: '0.9rem' }}
                    />
                  </Box>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/checkout", { state: { mealPlanId: plan._id } })}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Choose Plan
                  </Button>
                )}
              </Box>
            </CardWrapper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPage;
