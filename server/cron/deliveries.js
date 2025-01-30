import cron from "node-cron";
import { Order } from "../models/Order.model";
import { sendDeliveryNotification } from "../services/email";

const scheduleDeliveries = () => {
  // Run daily at 3 AM
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
        await sendDeliveryNotification(order.user, order);
        order.status = "processing";
        await order.save();
      }
    } catch (err) {
      console.error("Delivery scheduling error:", err);
    }
  });
};

export default scheduleDeliveries;
