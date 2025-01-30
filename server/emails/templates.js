export const emailTemplates = {
  passwordReset: (name, link) => `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${link}" 
           style="display: inline-block; padding: 12px 24px; 
                  background-color: #2563eb; color: white; 
                  text-decoration: none; border-radius: 4px;
                  margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,

  orderConfirmation: (order) => `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #059669;">Order Confirmed (#${order._id})</h2>
        <div style="border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
          <h3>Delivery Details</h3>
          <p>Date: ${new Date(order.deliveryDate).toLocaleDateString()}</p>
          <p>Method: ${order.deliveryMethod}</p>
        </div>
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; text-align: left;">Meal</th>
              <th style="padding: 12px; text-align: left;">Quantity</th>
              <th style="padding: 12px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">$${item.price}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `,
  subscriptionUpdateEmail: (changes) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #9c27b0;">Subscription Updated</h2>
    <p>Your subscription has been successfully updated:</p>
    <ul style="list-style: none; padding: 0;">
      ${Object.entries(changes)
        .map(
          ([key, value]) => `
        <li style="margin: 10px 0;">
          <strong>${key}:</strong> ${value}
        </li>
      `
        )
        .join("")}
    </ul>
    <p style="margin-top: 20px;">
      View your updated subscription in your 
      <a href="${process.env.APP_URL}/dashboard/subscriptions">dashboard</a>.
    </p>
  </div>
`,
  deliveryNotificationEmail: (order) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #d32f2f;">Delivery Coming Up!</h2>
    <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px;">
      <h3>Your delivery is scheduled for ${order.deliveryDate.toLocaleDateString()}</h3>
      <p>Expected arrival time: 10:00 AM - 2:00 PM</p>
      ${
        order.deliveryMethod === "pickup"
          ? `
        <p>Pickup location: 123 Main St, City</p>
      `
          : ""
      }
    </div>
    <p style="margin-top: 20px;">
      Need to make changes? 
      <a href="${process.env.APP_URL}/dashboard/orders/${order._id}">
        Update your delivery preferences
      </a>
    </p>
  </div>
`,
};
