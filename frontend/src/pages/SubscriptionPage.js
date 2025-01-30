import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Grid,
  Box,
  Chip,
} from "@mui/material";
import {
  showSuccessToast,
  showErrorToast,
} from "../components/ToastNotification";
import { useNavigate } from "react-router-dom";

const SubscriptionPage = () => {
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
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Manage Your Subscription
      </Typography>

      {subscription && (
        <Box
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Your Current Subscription
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Plan:</strong> {subscription.mealPlan.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Description:</strong> {subscription.mealPlan.description}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Price:</strong> ${subscription.mealPlan.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Meals per week:</strong> {subscription.mealPlan.mealsPerWeek}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Delivery Days:</strong>{" "}
            {subscription.mealPlan.deliveryDays.join(", ")}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelSubscription}
            sx={{ mt: 2 }}
          >
            Cancel Subscription
          </Button>
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Available Plans
      </Typography>
      <Grid container spacing={3}>
        {mealPlans.map((plan) => (
          <Grid item xs={12} md={4} key={plan._id}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor:
                  subscription?.mealPlan._id === plan._id
                    ? "#e0f7fa"
                    : "#fff", // Highlight if it's the subscribed plan
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>
                <Chip
                  label={`$${plan.price.toFixed(2)}`}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Meals per week:</strong> {plan.mealsPerWeek}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Delivery Days:</strong>{" "}
                  {plan.deliveryDays.join(", ")}
                </Typography>
                {subscription?.mealPlan._id === plan._id ? (
                  <Chip
                    label="Currently Subscribed"
                    color="success"
                    sx={{ mt: 2 }}
                  />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate("/checkout", { state: { mealPlanId: plan._id } })
                    }
                    sx={{ mt: 2 }}
                  >
                    Subscribe
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPage;
