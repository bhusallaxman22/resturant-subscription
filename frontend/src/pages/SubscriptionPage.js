// Path: frontend/src/pages/SubscriptionPage.js
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import CardWrapper from "../components/molecules/CardWrapper";
import DetailItem from "../components/atoms/DetailItem";
import StatusChip from "../components/atoms/StatusChip";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SubscriptionIcon from "@mui/icons-material/CardMembership";
import { keyframes } from "@emotion/react";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const SubscriptionPage = () => {
  const theme = useTheme();
  const [mealPlans, setMealPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openSwitchPlanDialog, setOpenSwitchPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
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
      console.error("Error fetching meal plans:", error);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        setSubscription(res.data);
      }
    } catch (error) {
      setSubscription(null);
    }
  };

  // This function will be called after the user confirms cancellation.
  const handleCancelSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optionally, show a success toast here.
      fetchUserSubscription();
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  // This function handles a plan selection. If a user is already subscribed,
  // it will open a confirmation dialog.
  const handlePlanSelection = (plan) => {
    if (subscription) {
      setSelectedPlan(plan);
      setOpenSwitchPlanDialog(true);
    } else {
      navigate("/checkout", { state: { mealPlanId: plan._id } });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #F5F6FF, #FFFFFF)",
        pb: 8,
        overflow: "hidden",
      }}
    >
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none", // Disable pointer events for floating elements
          "& > div": {
            position: "absolute",
            borderRadius: "30px",
            background: "rgba(124, 131, 253, 0.1)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.3)",
          },
        }}
      >
        <Box
          sx={{
            top: "10%",
            left: "5%",
            width: "80px",
            height: "80px",
            animation: `${float} 6s infinite`,
          }}
        />
        <Box
          sx={{
            bottom: "15%",
            right: "10%",
            width: "120px",
            height: "120px",
            animation: `${float} 7s infinite`,
          }}
        />
      </Box>

      {/* Main Content Container */}
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
          position: "relative",
          zIndex: 2,
          pointerEvents: "auto", // Ensure interactions are allowed here
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 8,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: theme.palette.text.primary,
          }}
        >
          <SubscriptionIcon fontSize="large" />
          Meal Plan Subscription
        </Typography>

        {subscription && (
          <CardWrapper icon={<LocalDiningIcon />} title="Active Subscription">
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
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenCancelDialog(true)}
                    sx={{
                      px: 4,
                      "&:hover": {
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.contrastText,
                      },
                      position: "relative",
                      zIndex: 3,
                    }}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardWrapper>
        )}

        <Typography
          variant="h4"
          sx={{
            mb: 6,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: theme.palette.text.primary,
          }}
        >
          <RestaurantMenuIcon />
          Available Meal Plans
        </Typography>

        <Grid container spacing={4}>
          {mealPlans?.map((plan) => (
            <Grid item xs={12} md={4} key={plan._id}>
              <CardWrapper
                sx={{
                  height: "100%",
                  border:
                    subscription?.mealPlan?._id === plan._id
                      ? `2px solid ${theme.palette.primary.main}`
                      : null,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[4],
                  },
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
                        fontSize: "1.1rem",
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
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
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                      <StatusChip
                        status="Active"
                        label="Current Plan"
                        sx={{ fontSize: "0.9rem" }}
                      />
                    </Box>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => handlePlanSelection(plan)}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        position: "relative", // Ensure button is layered properly
                        zIndex: 3, // Higher than floating elements
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

      {/* Confirmation Dialog for Cancel Subscription */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your subscription?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>No</Button>
          <Button
            onClick={async () => {
              await handleCancelSubscription();
              setOpenCancelDialog(false);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Switching Plans */}
      <Dialog
        open={openSwitchPlanDialog}
        onClose={() => setOpenSwitchPlanDialog(false)}
      >
        <DialogTitle>Switch Plan Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Switching to a new plan will cancel your current subscription. Do
            you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenSwitchPlanDialog(false);
              setSelectedPlan(null);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              navigate("/checkout", {
                state: { mealPlanId: selectedPlan?._id },
              });
              setOpenSwitchPlanDialog(false);
              setSelectedPlan(null);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPage;
