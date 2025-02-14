require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const scheduler = require("./cron/scheduler");

// Import Routes
const authRoutes = require("./routes/auth");
const subscriptionRoutes = require("./routes/subscriptions");
const orderRoutes = require("./routes/orders");
const planRoutes = require("./routes/plans");
const cateringRoutes = require("./routes/catering");
const newsletterRoutes = require("./routes/newsletter");
const reservationRoutes = require("./routes/reservation");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/stripe");
const stripeWebhook = require("./webhooks/stripe");
const tableRoutes = require("./routes/table");

// Initialize Express App
const app = express(); ~

  // Middleware
  app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.MEAL_PLAN_CLIENT_URL], // Support both frontend URLs
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.info("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Static Paths for Both Frontends
const defaultFrontendPath = path.resolve(__dirname, "./dist");
const mealPlanFrontendPath = path.resolve(__dirname, "./meal-plan/dist");

// **✅ Serve Static Assets First**
app.use("/assets", express.static(path.join(defaultFrontendPath, "assets"))); // Default frontend assets
app.use("/meal-plan-app/assets", express.static(path.join(mealPlanFrontendPath, "assets"))); // Meal plan frontend assets

// **✅ Serve Static Frontend Files**
app.use(express.static(mealPlanFrontendPath));
app.use("/meal-plan-app", express.static(mealPlanFrontendPath));

// **✅ API Routes**
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/catering", cateringRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stripe", stripeWebhook);
app.use("/api/reservation", reservationRoutes);
app.use("/api/table", tableRoutes);

// **✅ Ensure API Routes Take Precedence Over Frontend**
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// **✅ Serve React Apps for Client-Side Routing**
app.get("/meal-plan-app/*", (req, res) => {
  res.sendFile(path.join(mealPlanFrontendPath, "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(mealPlanFrontendPath, "index.html"));
});

// **✅ Error Handling Middleware**
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// **✅ Start the Server**
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`🚀 Server running on port ${PORT}`));
