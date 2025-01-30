import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { showErrorToast } from "../components/ToastNotification";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mealPlanId } = location.state || {};
  const [clientSecret, setClientSecret] = useState(null);
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    if (!mealPlanId) {
      navigate("/subscription");
      return;
    }

    const fetchCheckoutData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/subscriptions/checkout`,
          { mealPlanId, deliveryType },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCheckoutData(data);

        const paymentResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`,
          { amount: data.totalPrice },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClientSecret(paymentResponse.data.clientSecret);
      } catch (error) {
        showErrorToast("Error fetching checkout details.");
        console.error("Error fetching checkout details:", error);
        navigate("/subscription");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [mealPlanId, deliveryType]);

  if (loading || !clientSecret) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">
            Meal Plan: {checkoutData?.mealPlan?.name}
          </Typography>
          <Typography>
            Base Price: ${checkoutData?.basePrice.toFixed(2)}
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
            >
              <FormControlLabel
                value="pickup"
                control={<Radio />}
                label="Pickup (Free)"
              />
              <FormControlLabel
                value="delivery"
                control={<Radio />}
                label="Delivery ($5)"
              />
            </RadioGroup>
          </FormControl>
          <Typography>Tax: ${checkoutData?.tax.toFixed(2)}</Typography>
          <Typography variant="h6">
            Total: ${checkoutData?.totalPrice.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm
          mealPlanId={mealPlanId}
          totalPrice={checkoutData?.totalPrice}
          deliveryType={deliveryType}
        />
      </Elements>
    </Container>
  );
};

export default CheckoutPage;
