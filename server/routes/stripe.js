const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { authMiddleware } = require("../middleware/auth");
const Subscription = require("../models/Subscription.model");
const User = require("../models/User.model");

router.post("/create-payment-intent", authMiddleware, async (req, res) => {
  try {
    const { amount, mealPlanId, deliveryType } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

router.post("/confirm-payment", authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId, mealPlanId, deliveryType } = req.body;
    const userId = req.user.id;

    // Retrieve payment intent to check the status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Create a new subscription for the user
      const subscription = new Subscription({
        user: userId,
        mealPlan: mealPlanId,
        deliveryType: deliveryType,
        status: "active",
        nextDeliveryDate: calculateNextDeliveryDate(mealPlanId),
      });

      await subscription.save();

      res.json({ message: "Subscription successfully created", subscription });
    } else {
      res.status(400).json({ error: "Payment not completed successfully" });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});

// Utility function to determine the next delivery date
function calculateNextDeliveryDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const deliveryDays = calculateDeliveryDays(dayOfWeek);
  const daysToAdd = deliveryDays.includes(dayOfWeek) ? 0 : 1;
  const nextDeliveryDate = new Date(today);
  nextDeliveryDate.setDate(today.getDate() + daysToAdd);
  return nextDeliveryDate;
}

module.exports = router;
