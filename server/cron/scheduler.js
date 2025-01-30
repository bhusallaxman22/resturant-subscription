const cron = require("node-cron");
const { scheduleOrders } = require("../services/order");
const { sendOrderNotifications } = require("../services/notification");

cron.schedule("0 0 * * *", async () => {
  console.log("🚀 Running scheduled order processing...");
  await scheduleOrders();
  await sendOrderNotifications();
  console.log("✅ Order processing completed.");
});
