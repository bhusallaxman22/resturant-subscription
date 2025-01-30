const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription.model");
const User = require("../models/User.model");

const createStripeSubscription = async (userId, planType) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    const priceId =
      planType === "1-meal-per-week"
        ? process.env.STRIPE_PRICE_ID_1
        : process.env.STRIPE_PRICE_ID_2;

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    return subscription.id;
  } catch (error) {
    console.error("Error creating Stripe subscription:", error);
    throw error;
  }
};

const cancelStripeSubscription = async (stripeSubscriptionId) => {
  try {
    await stripe.subscriptions.del(stripeSubscriptionId);
    return true;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
};

module.exports = { createStripeSubscription, cancelStripeSubscription };
