require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/auth");
const subscriptionRoutes = require("./routes/subscriptions");
const orderRoutes = require("./routes/orders");
const planRoutes = require("./routes/plans");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/stripe");
const stripeWebhook = require("./webhooks/stripe");

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.info("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Serve Static Frontend
const distPath = path.resolve(__dirname, "./dist"); // Adjust based on your directory structure
app.use(express.static(distPath));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes); // Stripe Payment Routes
app.use("/api/stripe", stripeWebhook); // Stripe Webhooks

// Handle all other routes and serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`🚀 Server running on port ${PORT}`));
