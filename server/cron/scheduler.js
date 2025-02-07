const cron = require("node-cron");
const { scheduleOrders, sendOrderNotifications } = require("../services/order");
const Order = require("../models/Order.model"); // Use direct require
const { sendEmail } = require("../services/email");
const { emailTemplates } = require("../emails/templates");

// -----------------------------------------------------------------------------
// 1) Order Processing Job - runs every day at 10 AM
// -----------------------------------------------------------------------------
cron.schedule("0 10 * * *", async () => {
  console.log("🚀 [Daily] Running scheduled order processing at 10 AM...");
  await scheduleOrders();
  await sendOrderNotifications();
  console.log("✅ [Daily] Order processing completed.");
});

// -----------------------------------------------------------------------------
// 2) Delivery Scheduling Job - runs every day at 10 AM
// -----------------------------------------------------------------------------
cron.schedule("0 10 * * *", async () => {
  try {
    console.log("🚚 [Daily] Checking upcoming orders for delivery at 10 AM...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingOrders = await Order.find({
      deliveryDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: tomorrow.setHours(23, 59, 59, 999),
      },
      status: "scheduled",
    }).populate("user");

    for (const order of upcomingOrders) {
      await sendEmail(
        order.user.email,
        "Delivery Reminder",
        "Your meal is out for delivery soon!",
        emailTemplates.deliveryNotificationEmail(order)
      );
      order.status = "processing";
      await order.save();
    }
    console.log("✅ [Daily] Delivery scheduling completed.");
  } catch (err) {
    console.error("Delivery scheduling error:", err);
  }
});
