// Path: frontend/src/pages/CheckoutPage.js
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
  Box,
  useTheme,
  Avatar,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { showErrorToast } from "../components/atoms/ToastNotifications";
import CheckoutForm from "../components/molecules/CheckoutForm";
import {
  LocalShipping,
  Storefront,
  RestaurantMenu,
  ReceiptLong,
  CreditCard,
} from "@mui/icons-material";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const theme = useTheme();
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

  if (loading || !clientSecret) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={80} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{
        mb: 6,
        textAlign: 'center',
        p: 4,
        borderRadius: '40px',
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Avatar sx={{
          width: 80,
          height: 80,
          mb: 3,
          backgroundColor: theme.palette.primary.main,
          boxShadow: '4px 4px 12px rgba(0,0,0,0.1)'
        }}>
          <ReceiptLong sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" sx={{
          fontWeight: 800,
          color: theme.palette.text.primary,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          Checkout
        </Typography>
      </Box>

      {/* Order Details Card */}
      <Card sx={{
        borderRadius: '32px',
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px)',
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CardContent>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}>
            <RestaurantMenu sx={{
              fontSize: 40,
              color: theme.palette.primary.main,
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
            }} />
            <Typography variant="h5" sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
            }}>
              {checkoutData?.mealPlan?.name}
            </Typography>
          </Box>

          {/* Pricing Section */}
          <Box sx={{
            mb: 3,
            p: 3,
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.04), -2px -2px 8px rgba(255, 255, 255, 0.6)',
            position: 'relative'
          }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">
                  Base Price:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${checkoutData?.basePrice.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">
                  Tax:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${checkoutData?.tax.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${checkoutData?.totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Delivery Options */}
          <FormControl component="fieldset" sx={{
            mt: 2,
            p: 3,
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.04), -2px -2px 8px rgba(255, 255, 255, 0.6)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LocalShipping sx={{
                fontSize: 32,
                color: theme.palette.primary.main,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
              }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Delivery Options
              </Typography>
            </Box>
            <RadioGroup
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
            >
              <FormControlLabel
                value="pickup"
                control={<Radio sx={{
                  color: theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  }
                }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Storefront sx={{ color: theme.palette.text.secondary }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Pickup (Free)
                    </Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                value="delivery"
                control={<Radio sx={{
                  color: theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  }
                }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping sx={{ color: theme.palette.text.secondary }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Delivery ($5)
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Box sx={{
        borderRadius: '32px',
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '12px 12px 32px rgba(0, 0, 0, 0.06), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px)',
        p: 4,
        position: 'relative'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3
        }}>
          <CreditCard sx={{
            fontSize: 40,
            color: theme.palette.primary.main,
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
          }} />
          <Typography variant="h5" sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
          }}>
            Payment Details
          </Typography>
        </Box>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            mealPlanId={mealPlanId}
            totalPrice={checkoutData?.totalPrice}
            deliveryType={deliveryType}
          />
        </Elements>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
