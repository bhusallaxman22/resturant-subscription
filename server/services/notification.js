const { sendEmail } = require("./email");
const User = require("../models/User.model");
const Order = require("../models/Order.model");

const sendOrderNotifications = async () => {
  try {
    const upcomingOrders = await Order.find({ status: "pending" }).populate(
      "user meals"
    );

    for (const order of upcomingOrders) {
      const emailText = `Hello ${order.user.name}, your meal delivery is scheduled for ${order.deliveryDate}.`;
      const emailHtml = `<p>Hello ${order.user.name},</p>
                         <p>Your meal delivery is scheduled for <strong>${order.deliveryDate}</strong>.</p>`;

      await sendEmail(
        order.user.email,
        "Upcoming Meal Delivery",
        emailText,
        emailHtml
      );
      console.log(`✅ Notification sent to ${order.user.email}`);
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

module.exports = { sendOrderNotifications };
