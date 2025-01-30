const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "out-for-delivery",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
