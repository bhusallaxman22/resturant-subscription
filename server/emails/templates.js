// A helper function that builds the full HTML email using a common design
const buildEmail = (subject, content) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${subject}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- Use Montserrat for a modern look -->
      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          font-family: 'Montserrat', sans-serif;
        }
        table {
          border-collapse: collapse;
        }
        /* Header */
        .header {
          background-color: #000000;
          text-align: center;
          padding: 20px;
        }
        .header img {
          width: 120px;
          display: block;
          margin: 0 auto;
        }
        .header h1 {
          color: #ffffff;
          font-size: 24px;
          letter-spacing: 2px;
          margin: 10px 0 0;
        }
        /* Content */
        .content {
          padding: 40px 20px;
          text-align: center;
        }
        .content h2 {
          color: #333333;
          font-size: 28px;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          color: #555555;
          line-height: 1.5;
        }
        .cta a {
          background-color: #9333ea;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          font-size: 16px;
        }
        /* Footer */
        .footer {
          background-color: #f0f0f0;
          padding: 20px;
          text-align: center;
          color: #777777;
          font-size: 12px;
        }
        .footer a {
          color: #2563eb;
          text-decoration: none;
        }
        /* Table of order items */
        .order-table {
          width: 100%;
          border: 1px solid #dddddd;
          margin: 20px 0;
          border-collapse: collapse;
        }
        .order-table th,
        .order-table td {
          padding: 8px;
          text-align: left;
          font-size: 14px;
        }
        .order-table th {
          background-color: #f6f6f6;
        }
        /* Changes summary list */
        .changes {
          background-color: #f6f6f6;
          padding: 20px;
          border-radius: 8px;
          text-align: left;
          display: inline-block;
          max-width: 100%;
        }
        .changes h3 {
          color: #9333ea;
          font-size: 20px;
          margin-bottom: 15px;
        }
        .changes ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .changes li {
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
          font-size: 16px;
          color: #555555;
        }
        .changes li:last-child {
          border-bottom: none;
        }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0">
        <!-- Header -->
        <tr>
          <td class="header">
            <table width="640" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <img src="https://i.ibb.co/7YxR0y0/logo.png" alt="Saffron Kitchen Logo" />
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h1>${subject.toUpperCase()}</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Main Content -->
        <tr>
          <td class="content">
            <table width="640" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  ${content}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td class="footer">
            <table width="640" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p>
                    5005 S Cooper St Suite 163, Arlington, Texas 76017 | +1 (555) 123-4567
                  </p>
                  <p>© 2025 Saffron Kitchen. All rights reserved.</p>
                  <p>
                    <a href="http://saffron.bhusallaxman.com.np/">
                      Visit Our Website
                    </a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`
  ;

// Define your email templates using the common buildEmail design.
const emailTemplates = {
  passwordReset: (name, link) => {
    const content =
      `<h2>Password Reset</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to reset it.</p>
        <div class="cta" style="margin: 20px 0;">
          <a href="${link}">Reset Password</a>
        </div>
        <p>Note: This link expires in 1 hour.</p>
      `;
    return buildEmail("Password Reset", content);
  },

  orderConfirmation: (order) => {
    // Format the delivery date
    const deliveryDate = new Date(order.deliveryDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Use the meals array from the populated mealPlan.
    const meals = order.mealPlan && order.mealPlan.meals ? order.mealPlan.meals : [];

    let itemsHTML = "";
    if (meals.length > 0) {
      itemsHTML =
        `<table class="order-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
            ${meals.map(meal => {
          return (
          `<tr>
            <td>${meal.name}</td>
            <td>1</td>
            <td>$${meal.price}</td>
          </tr>`
          )
        }
        ).join("")}
            </tbody>
          </table>`
        ;
    } else {
      itemsHTML = `<p>Meal details are not available.</p>`;
    }

    const content =
      `<h2>Order Confirmation #${order._id}</h2>
        <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
        ${itemsHTML}
      `;

    return buildEmail("Order Confirmation", content);
  },


  subscriptionUpdateEmail: (changes) => {
    // Convert any camelCase keys to Title Case.
    const changesList = Object.entries(changes)
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        return `<li><strong>${formattedKey}:</strong> ${value}</li>`;
      })
      .join("");
    const content =
      ` <h2>Subscription Updated</h2>
        <div class="changes">
          <h3>Changes Summary</h3>
          <ul>
            ${changesList}
          </ul>
        </div>
        <div class="cta" style="margin-top: 20px;">
          <a href="${process.env.APP_URL}/dashboard/subscriptions">View Subscription</a>
        </div>
      `;
    return buildEmail("Subscription Updated", content);
  },

  deliveryNotificationEmail: (order) => {
    // Format the delivery date (simple format)
    const deliveryDate = new Date(order.deliveryDate).toLocaleDateString("en-US");
    const content =
      ` <h2>Delivery Notification</h2>
        <p>Your delivery is scheduled for <strong>${deliveryDate}</strong>.</p>
        ${order.deliveryMethod === "pickup"
        ? "<p><strong>Pickup Location:</strong> 5005 S Cooper St Suite 163, Arlington, Texas 76017</p>"
        : ""
      }
        <div class="cta" style="margin-top: 20px;">
          <a href="${process.env.APP_URL}/dashboard/orders/${order._id}">Update Delivery Preferences</a>
        </div>
     ` ;
    return buildEmail("Delivery Notification", content);
  }
};

module.exports = { emailTemplates };

