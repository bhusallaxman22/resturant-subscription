const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User.model");

// Create a Stripe subscription
const createStripeSubscription = async (userId, stripePriceId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    // Create or retrieve a Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
    });

    // Create a Stripe subscription with the dynamic price ID
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: stripePriceId }], // Use the dynamic price ID
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    return {
      stripeSubscriptionId: stripeSubscription.id,
      clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret, // For client-side payment confirmation
    };
  } catch (error) {
    console.error("Error creating Stripe subscription:", error);
    throw error;
  }
};

// Cancel a Stripe subscription
const cancelStripeSubscription = async (stripeSubscriptionId) => {
  try {
    await stripe.subscriptions.del(stripeSubscriptionId);
    return true;
  } catch (error) {
    console.error("Error canceling Stripe subscription:", error);
    throw error;
  }
};

module.exports = { createStripeSubscription, cancelStripeSubscription };
