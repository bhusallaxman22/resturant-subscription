const cron = require("node-cron");
const { scheduleOrders } = require("../services/order");
const { sendOrderNotifications } = require("../services/notification");
const  {Order}  = require("../models/Order.model");

cron.schedule("0 0 * * *", async () => {
  console.log("🚀 Running scheduled order processing...");
  await scheduleOrders();
  await sendOrderNotifications();
  console.log("✅ Order processing completed.");
});

cron.schedule("0 3 * * *", async () => {
  try {
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
  } catch (err) {
    console.error("Delivery scheduling error:", err);
  }
});

// const cron = require("node-cron");
// const { scheduleOrders } = require("../services/order");
// const { sendOrderNotifications } = require("../services/notification");
// const { Order } = require("../models/Order.model");
// const { sendEmail } = require("../services/email");
// const { emailTemplates } = require("../emails/templates");

// // 1) Order processing job - run every 2 minutes (for testing)
// cron.schedule("*/2 * * * *", async () => {
//   console.log("🚀 [Test] Running scheduled order processing...");
//   await scheduleOrders();
//   await sendOrderNotifications();
//   console.log("✅ [Test] Order processing completed.");
// });

// // 2) Delivery scheduling job - also run every 2 minutes (for testing)
// cron.schedule("*/2 * * * *", async () => {
//   try {
//     console.log("🚚 [Test] Checking upcoming orders for delivery...");
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const upcomingOrders = await Order.find({
//       deliveryDate: {
//         $gte: new Date().setHours(0, 0, 0, 0),
//         $lt: tomorrow.setHours(23, 59, 59, 999),
//       },
//       status: "scheduled",
//     }).populate("user");

//     for (const order of upcomingOrders) {
//       await sendEmail(
//         order.user.email,
//         "Delivery Reminder",
//         "Your meal is out for delivery soon!",
//         emailTemplates.deliveryNotificationEmail(order)
//       );
//       order.status = "processing";
//       await order.save();
//     }
//     console.log("✅ [Test] Delivery scheduling completed.");
//   } catch (err) {
//     console.error("Delivery scheduling error:"   , err);
//   }
// })