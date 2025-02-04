// Path: frontend/src/components/CheckoutForm.js
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "./ToastNotification";

const CheckoutForm = ({ mealPlanId, totalPrice, deliveryType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        showErrorToast("Error processing payment.");
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const token = localStorage.getItem("token");

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/subscriptions/subscribe`,
          {
            paymentIntentId: paymentIntent.id,
            mealPlanId,
            deliveryType,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showSuccessToast("Payment successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during subscription:", error.response?.data || error.message);
      showErrorToast("Error Subscribing to the plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="body1" gutterBottom>
        Payment Details
      </Typography>
      <PaymentElement />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={!stripe || !elements || loading}
      >
        {loading ? <CircularProgress size={24} /> : `Pay $${totalPrice.toFixed(2)}`}
      </Button>
    </Box>
  );
};

export default CheckoutForm;
