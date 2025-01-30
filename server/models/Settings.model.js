const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    subscriptionPlans: [
      {
        planType: {
          type: String,
          enum: ["1-meal-per-week", "2-meals-per-week"],
          required: true,
        },
        price: { type: Number, required: true },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
