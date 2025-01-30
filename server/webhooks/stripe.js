const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;
    const sig = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed.");
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscriptionId = event.data.object.subscription;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscriptionId },
        { isActive: true }
      );
      console.log("✅ Subscription activated");
    } else if (event.type === "invoice.payment_failed") {
      const subscriptionId = event.data.object.subscription;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscriptionId },
        { isActive: false }
      );
      console.log("❌ Subscription payment failed");
    }

    res.json({ received: true });
  }
);

module.exports = router;
