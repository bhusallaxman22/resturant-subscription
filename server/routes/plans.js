const express = require("express");
const MealPlan = require("../models/MealPlan.model");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { syncMealPlanWithStripe } = require("../utils/stripe");

const router = express.Router();

// Get all meal plans
router.get("/", async (req, res) => {
  try {
    const mealPlans = await MealPlan.find();
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meal plans." });
  }
});

// Get meal plan by ID
router.get("/:id", async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found." });
    }
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meal plan." });
    console.error(error);
  }
});

// Admin: Add a meal plan
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, meals, deliveryDays } = req.body;

    const newMealPlan = new MealPlan({
      name,
      description,
      price,
      meals,
      deliveryDays,
    });

    // Sync with Stripe
    newMealPlan.stripePriceId = await syncMealPlanWithStripe(newMealPlan);

    await newMealPlan.save();
    res.status(201).json(newMealPlan);
  } catch (error) {
    console.error("Error adding meal plan:", error);
    res.status(500).json({ message: "Error adding meal plan." });
  }
});


// Admin: Update a meal plan
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found." });
    }

    Object.assign(mealPlan, req.body);

    // Sync updates with Stripe
    mealPlan.stripePriceId = await syncMealPlanWithStripe(mealPlan);

    await mealPlan.save();
    res.json(mealPlan);
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).json({ message: "Error updating meal plan." });
  }
});


// Admin: Delete a meal plan
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await MealPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Meal plan deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal plan." });
  }
});

module.exports = router;
