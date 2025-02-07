const Order = require("../models/Order.model");
const Subscription = require("../models/Subscription.model");
const { emailTemplates } = require("../emails/templates");
const { sendEmail } = require("../services/email");

// Helper function to get next delivery date from an array or single day
const getNextDeliveryDate = (days) => {
  const today = new Date();
  // days may be an array; try each until one is found
  if (Array.isArray(days)) {
    for (const day of days) {
      const date = getUpcomingDay(today, day);
      if (date) return date;
    }
  } else {
    return getUpcomingDay(today, days);
  }
  return null;
};

const getUpcomingDay = (currentDate, dayOfWeek) => {
  const daysOfWeek = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };
  const targetDay = daysOfWeek[dayOfWeek];
  if (targetDay === undefined) return null;

  const date = new Date(currentDate);
  // Calculate difference (if today is the target, schedule for next week)
  const diff = (targetDay + 7 - currentDate.getDay()) % 7 || 7;
  date.setDate(currentDate.getDate() + diff);
  return date;
};

const scheduleOrders = async () => {
  try {
    // Populate mealPlan (not meals) and user on subscriptions
    const activeSubscriptions = await Subscription.find({
      isActive: true,
    }).populate("mealPlan user");

    for (const sub of activeSubscriptions) {
      // Use deliveryDays from the populated mealPlan
      const deliveryDays = sub.mealPlan.deliveryDays;
      const deliveryDate = getNextDeliveryDate(deliveryDays);
      if (!deliveryDate) {
        console.error(
          `Unable to determine next delivery date for subscription ${ sub._id }`
        );
        continue;
      }

      // Create new order referencing the mealPlan instead of duplicating meals
      const newOrder = new Order({
        user: sub.user._id,
        subscription: sub._id,
        mealPlan: sub.mealPlan._id, // Just store the reference
        deliveryDate,
        status: "pending",
      });


      await newOrder.save();
      console.log(
        `✅ Order scheduled for ${ sub.user.email } on ${ deliveryDate }`
      );
    }
  } catch (error) {
  console.error("Error scheduling orders:", error);
}
};

const sendOrderNotifications = async () => {
  try {
    // Define start and end of today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Find all pending orders for delivery today
    const orders = await Order.find({
      status: "pending",
      deliveryDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate({
      path: "user mealPlan.meals"
    });

    if (!orders || orders.length === 0) {
      console.log("No pending orders for delivery today.");
      return;
    }

    // Sort orders by deliveryDate ascending and select the earliest one
    orders.sort((a, b) => a.deliveryDate - b.deliveryDate);
    const nextOrder = orders[0];
    console.log(nextOrder);
    // Use the orderConfirmation template (or fallback if not defined)
    const emailHtml = emailTemplates.orderConfirmation(nextOrder);


    await sendEmail(
      nextOrder.user.email,
      "Upcoming Meal Delivery",
      "Your meal delivery is scheduled soon!",
      emailHtml
    );
    console.log(`✅ Notification sent to ${ nextOrder.user.email }`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

module.exports = { scheduleOrders, sendOrderNotifications };