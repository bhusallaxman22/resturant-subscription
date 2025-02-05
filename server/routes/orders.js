const express = require("express");
const Order = require("../models/Order.model");
const Subscription = require("../models/Subscription.model");
const MealPlan = require("../models/MealPlan.model");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get orders for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate({
      path: "subscription",
      populate: { path: "mealPlan" }, // Only populate `mealPlan`
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching orders." });
  }
});

// Admin: Get all orders
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email address")
      .populate({
        path: "subscription",
        populate: { path: "mealPlan" },
      });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Error fetching all orders." });
  }
});

// Create a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { deliveryDate } = req.body;

    const subscription = await Subscription.findOne({
      user: req.user._id,
      isActive: true,
    }).populate("mealPlan");

    if (!subscription) {
      return res.status(400).json({ message: "No active subscription found." });
    }

    const order = new Order({
      user: req.user._id,
      subscription: subscription._id,
      meals: subscription.mealPlan.meals,
      deliveryDate,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order." });
  }
});

// Admin: Update order status
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated.", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status." });
  }
});

module.exports = router;
