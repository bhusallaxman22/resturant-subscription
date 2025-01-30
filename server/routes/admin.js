const express = require("express");
const User = require("../models/User.model");
const Subscription = require("../models/Subscription.model");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all subscriptions
router.get(
  "/subscriptions",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const subscriptions = await Subscription.find().populate("user meals");
    res.json(subscriptions);
  }
);

module.exports = router;
