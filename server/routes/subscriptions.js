const express = require("express");
const Subscription = require("../models/Subscription.model");
const Order = require("../models/Order.model");
const MealPlan = require("../models/MealPlan.model");
const { authMiddleware } = require("../middleware/auth");
const calculateUpcomingDeliveryDates = require("../utils/deliveryDays");
const { createStripeSubscription, cancelStripeSubscription } = require("../services/stripe");
const { sendEmail } = require("../services/email");
const { emailTemplates } = require("../emails/templates");

const router = express.Router();

// Get user's subscription
router.get("/", authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      isActive: true,
    }).populate("mealPlan");
    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found." });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscription." });
  }
});

// Checkout: Calculate price details
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { mealPlanId, deliveryType } = req.body;

    if (!mealPlanId || !deliveryType) {
      return res
        .status(400)
        .json({ message: "Meal plan ID and delivery type are required." });
    }

    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found." });
    }

    const deliveryFee = deliveryType === "delivery" ? 5.0 : 0.0;
    const taxRate = 0.1;
    const tax = (mealPlan.price + deliveryFee) * taxRate;
    const totalPrice = mealPlan.price + deliveryFee + tax;

    res.json({
      mealPlan,
      basePrice: mealPlan.price,
      deliveryFee,
      tax,
      totalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating checkout details." });
  }
});

// Subscribe: Create or update a subscription

router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { mealPlanId, deliveryType } = req.body;

    if (!mealPlanId || !deliveryType) {
      return res.status(400).json({ message: "Meal plan ID and delivery type are required." });
    }

    // Find the meal plan
    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan || !mealPlan.stripePriceId) {
      return res.status(404).json({ message: "Meal plan not found or not synced with Stripe." });
    }

    // Cancel any existing subscriptions for the user
    await Subscription.updateMany({ user: req.user._id }, { isActive: false });

    // Create a Stripe subscription
    const { stripeSubscriptionId, clientSecret } = await createStripeSubscription(
      req.user._id,
      mealPlan.stripePriceId // Use the dynamic Stripe price ID
    );

    // Create a local subscription
    const newSubscription = new Subscription({
      user: req.user._id,
      mealPlan: mealPlan._id,
      deliveryType,
      stripeSubscriptionId,
      isActive: true,
      nextDeliveryDate: calculateUpcomingDeliveryDates(mealPlan.deliveryDays, 1)[0],
    });

    await newSubscription.save();

    // Generate orders for the next 4 weeks
    const deliveryDates = calculateUpcomingDeliveryDates(mealPlan.deliveryDays, 4);
    const orders = deliveryDates.map((deliveryDate) => ({
      user: req.user._id,
      subscription: newSubscription._id,
      meals: mealPlan.meals,
      deliveryDate,
      status: "pending",
    }));

    await Order.insertMany(orders);
    
    const changes = {
      planName: mealPlan.name,
      deliveryType,
      nextDeliveryDate: newSubscription.nextDeliveryDate,
    };

    await sendEmail(
      req.user.email,
      "Subscription Updated",
      "Your subscription has been updated",
      emailTemplates.subscriptionUpdateEmail(changes)
    );
    
    res.status(201).json({
      message: "Subscription created successfully.",
      subscription: newSubscription,
      clientSecret, // Return the client secret for Stripe payment confirmation
    });
  } catch (error) {
    console.error("Error subscribing to meal plan:", error);
    res.status(500).json({ message: "Error subscribing to meal plan." });
  }
});


// Cancel subscription
router.post("/cancel", authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found." });
    }

    // Cancel the Stripe subscription
    if (subscription.stripeSubscriptionId) {
      await cancelStripeSubscription(subscription.stripeSubscriptionId);
    }

    // Mark the local subscription as inactive
    subscription.isActive = false;
    await subscription.save();

    // Cancel all associated future orders
    await Order.updateMany(
      { subscription: subscription._id, status: { $in: ["pending", "preparing"] } },
      { status: "cancelled" }
    );

    res.json({ message: "Subscription and associated orders canceled successfully." });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ message: "Error canceling subscription and orders." });
  }
});


module.exports = router;
