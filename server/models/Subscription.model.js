const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MealPlan",
    required: true,
  },
  deliveryType: { type: String, enum: ["pickup", "delivery"], required: true },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  nextDeliveryDate: { type: Date },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
