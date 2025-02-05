const Order = require("../models/Order.model");
const Subscription = require("../models/Subscription.model");

const scheduleOrders = async () => {
  try {
    const activeSubscriptions = await Subscription.find({
      isActive: true,
    }).populate("meals user");

    for (const sub of activeSubscriptions) {
      const nextDeliveryDay =
        sub.planType === "1-meal-per-week" ? "Monday" : ["Monday", "Thursday"];
      const deliveryDate = getNextDeliveryDate(nextDeliveryDay);

      const newOrder = new Order({
        user: sub.user._id,
        subscription: sub._id,
        meals: sub.meals,
        deliveryDate,
        status: "pending",
      });

      await newOrder.save();
      console.log(
        `✅ Order scheduled for ${sub.user.email} on ${deliveryDate}`
      );
    }
  } catch (error) {
    console.error("Error scheduling orders:", error);
  }
};

const getNextDeliveryDate = (days) => {
  const today = new Date();
  if (Array.isArray(days)) {
    for (const day of days) {
      const date = getUpcomingDay(today, day);
      if (date) return date;
    }
  } else {
    return getUpcomingDay(today, days);
  }
};

const getUpcomingDay = (currentDate, dayOfWeek) => {
  const daysOfWeek = { Monday: 1, Thursday: 4 };
  const day = daysOfWeek[dayOfWeek];
  if (day === undefined) return null;

  const date = new Date(currentDate);
  date.setDate(
    currentDate.getDate() + ((day + 7 - currentDate.getDay()) % 7 || 7)
  );
  return date;
};

module.exports = { scheduleOrders };
