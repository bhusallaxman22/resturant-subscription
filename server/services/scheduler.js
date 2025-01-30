import cron from "node-cron";
import { Order } from "../models/Order.model";

export const scheduleDeliveries = () => {
  // Run daily at 3 AM
  cron.schedule("0 3 * * *", async () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const subscriptions = await Subscription.find({
      status: "active",
      nextDeliveryDate: { $lte: nextWeek },
    });

    subscriptions.forEach(async (sub) => {
      await Order.create({
        user: sub.user,
        subscription: sub._id,
        deliveryDate: sub.nextDeliveryDate,
        status: "scheduled",
      });

      sub.nextDeliveryDate = calculateNextDelivery(sub.deliveryDays);
      await sub.save();
    });
  });
};
const cancelSubscription = async (stripeSubscriptionId) => {
  try {
    await stripe.subscriptions.del(stripeSubscriptionId);
    console.log(`Subscription ${stripeSubscriptionId} canceled on Stripe`);
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw new Error("Failed to cancel subscription on Stripe");
  }
};

module.exports = { createSubscription, webhookHandler, cancelSubscription };
