const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    contactNumber: { type: String },
    dob: { type: Date },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
