const footerTemplate = `
  <div style="
    margin-top: 40px;
    padding: 24px;
    background: rgba(255,255,255,0.3);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.4);
    text-align: center;
    animation: fadeInUp 0.6s 0.4s ease-out both;
  ">
    <div style="
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
    ">
      <a href="#" style="text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
             alt="Instagram" 
             style="width: 28px; transition: transform 0.3s ease;"
             onmouseover="this.style.transform='scale(1.2)'"
             onmouseout="this.style.transform='scale(1)'">
      </a>
      <a href="#" style="text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" 
             alt="Facebook" 
             style="width: 28px; transition: transform 0.3s ease;"
             onmouseover="this.style.transform='scale(1.2)'"
             onmouseout="this.style.transform='scale(1)'">
      </a>
      <a href="#" style="text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/3536/3536569.png" 
             alt="Twitter" 
             style="width: 28px; transition: transform 0.3s ease;"
             onmouseover="this.style.transform='scale(1.2)'"
             onmouseout="this.style.transform='scale(1)'">
      </a>
    </div>
    <p style="margin: 8px 0; color: #4b5563;">
      🍴 Saffron Kitchen • Crafting Culinary Excellence
    </p>
    <p style="margin: 8px 0; color: #4b5563;">
      📍 123 Spice Lane, Culinary City • 📞 +1 (555) 123-4567
    </p>
    <p style="margin: 8px 0; color: #4b5563;">
      <a href="https://saffronkitchen.com" 
         style="color: #2563eb; text-decoration: none; font-weight: 500;">
         🌐 Visit Our Website
      </a>
    </p>
  </div>

  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  </style>
`;

export const emailTemplates = {
  passwordReset: (name, link) => `
    <div style="
      max-width: 600px;
      margin: 2rem auto;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9));
      backdrop-filter: blur(12px);
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.4);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
      padding: 40px;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.8s ease-out;
    ">
      <!-- Floating background element -->
      <div style="
        position: absolute;
        top: -80px;
        right: -80px;
        width: 200px;
        height: 200px;
        background: rgba(37, 99, 235, 0.08);
        border-radius: 50%;
        animation: float 8s ease-in-out infinite;
      "></div>

      <img src="https://i.ibb.co/7YxR0y0/logo.png" 
           alt="Saffron Kitchen" 
           style="
             width: 120px;
             margin: 0 auto 32px;
             display: block;
             filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
             animation: fadeInUp 0.6s ease-out;
           ">

      <div style="
        background: rgba(255,255,255,0.7);
        padding: 32px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(8px);
        animation: fadeInUp 0.6s 0.2s ease-out both;
      ">
        <h2 style="
          color: #2563eb;
          font-size: 28px;
          margin-bottom: 24px;
          text-align: center;
        ">
          🔑 Password Reset
        </h2>

        <p style="
          color: #4b5563;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 24px;
          text-align: center;
        ">
          Hello <strong>${name}</strong>,<br>
          We received a request to reset your password.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}"
             style="
               display: inline-block;
               padding: 14px 32px;
               background: linear-gradient(135deg, #2563eb, #1d4ed8);
               color: white;
               text-decoration: none;
               border-radius: 12px;
               font-weight: 600;
               font-size: 16px;
               transition: all 0.3s ease;
               box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
               position: relative;
               overflow: hidden;
             "
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(37, 99, 235, 0.3)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(37, 99, 235, 0.2)'">
            Reset Password
          </a>
        </div>

        <p style="
          color: #6b7280;
          font-size: 14px;
          text-align: center;
          margin-top: 24px;
        ">
          ⏳ Link expires in 1 hour
        </p>
      </div>

      ${footerTemplate}
    </div>
  `,

  orderConfirmation: (order) => `
    <div style="
      max-width: 600px;
      margin: 2rem auto;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9));
      backdrop-filter: blur(12px);
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.4);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
      padding: 40px;
      animation: fadeInUp 0.8s ease-out;
    ">
      <img src="https://i.ibb.co/7YxR0y0/logo.png" 
           alt="Saffron Kitchen" 
           style="
             width: 120px;
             margin: 0 auto 32px;
             display: block;
             filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
             animation: fadeInUp 0.6s ease-out;
           ">

      <div style="
        background: rgba(255,255,255,0.7);
        padding: 32px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(8px);
        margin-bottom: 32px;
        animation: fadeInUp 0.6s 0.2s ease-out both;
      ">
        <h2 style="
          color: #059669;
          font-size: 28px;
          margin-bottom: 24px;
          text-align: center;
        ">
          🎉 Order Confirmed #${order._id}
        </h2>

        <div style="
          background: rgba(229, 231, 235, 0.3);
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 24px;
        ">
          <h3 style="
            color: #059669;
            font-size: 20px;
            margin-bottom: 16px;
          ">
            🚚 Delivery Details
          </h3>
          <p style="color: #4b5563; margin: 12px 0;">
            📅 ${new Date(order.deliveryDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p style="color: #4b5563; margin: 12px 0;">
            🚚 ${order.deliveryMethod.charAt(0).toUpperCase() + order.deliveryMethod.slice(1)}
          </p>
        </div>

        <table style="
          width: 100%;
          border-collapse: collapse;
          background: rgba(255,255,255,0.9);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        ">
          <thead>
            <tr style="background: rgba(5, 150, 105, 0.1);">
              <th style="padding: 16px; text-align: left; color: #059669;">🍽️ Meal</th>
              <th style="padding: 16px; text-align: left; color: #059669;">📦 Quantity</th>
              <th style="padding: 16px; text-align: left; color: #059669;">💰 Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid rgba(209, 213, 219, 0.3);">
                <td style="padding: 16px; color: #4b5563;">${item.name}</td>
                <td style="padding: 16px; color: #4b5563;">${item.quantity}</td>
                <td style="padding: 16px; color: #4b5563;">$${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${footerTemplate}
    </div>
  `,

  subscriptionUpdateEmail: (changes) => `
    <div style="
      max-width: 600px;
      margin: 2rem auto;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9));
      backdrop-filter: blur(12px);
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.4);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
      padding: 40px;
      animation: fadeInUp 0.8s ease-out;
    ">
      <img src="https://i.ibb.co/7YxR0y0/logo.png" 
           alt="Saffron Kitchen" 
           style="
             width: 120px;
             margin: 0 auto 32px;
             display: block;
             filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
             animation: fadeInUp 0.6s ease-out;
           ">

      <div style="
        background: rgba(255,255,255,0.7);
        padding: 32px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(8px);
        margin-bottom: 32px;
        animation: fadeInUp 0.6s 0.2s ease-out both;
      ">
        <h2 style="
          color: #9333ea;
          font-size: 28px;
          margin-bottom: 24px;
          text-align: center;
        ">
          🔄 Subscription Updated
        </h2>

        <div style="
          background: rgba(147, 51, 234, 0.08);
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 24px;
        ">
          <h3 style="
            color: #9333ea;
            font-size: 20px;
            margin-bottom: 16px;
          ">
            📝 Changes Summary
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${Object.entries(changes).map(([key, value]) => `
              <li style="
                padding: 12px 0;
                border-bottom: 1px solid rgba(209, 213, 219, 0.3);
                color: #4b5563;
              ">
                <span style="display: inline-block; width: 120px; color: #9333ea;">
                  ${key}:
                </span>
                ${value}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.APP_URL}/dashboard/subscriptions"
             style="
               display: inline-block;
               padding: 12px 24px;
               background: linear-gradient(135deg, #9333ea, #6b21a8);
               color: white;
               text-decoration: none;
               border-radius: 8px;
               font-weight: 500;
               transition: all 0.3s ease;
               box-shadow: 0 4px 6px rgba(147, 51, 234, 0.2);
             "
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(147, 51, 234, 0.3)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(147, 51, 234, 0.2)'">
            View Subscription
          </a>
        </div>
      </div>

      ${footerTemplate}
    </div>
  `,

  deliveryNotificationEmail: (order) => `
    <div style="
      max-width: 600px; 
      margin: 0 auto; 
      font-family: 'Arial', sans-serif; 
      background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9));
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      padding: 32px;
    ">
      <img src="https://via.placeholder.com/100" alt="Saffron Kitchen Logo" style="width: 100px; margin-bottom: 20px;"/>
      <h2 style="color: #d32f2f; font-size: 24px; margin-bottom: 16px;">
        🚚 Delivery Coming Up!
      </h2>
      <div style="
        background: rgba(255, 243, 224, 0.8);
        padding: 16px;
        border-radius: 12px;
        border: 1px solid rgba(209, 213, 219, 0.3);
        margin-bottom: 24px;
      ">
        <h3 style="color: #d32f2f; font-size: 18px; margin-bottom: 12px;">
          Your delivery is scheduled for ${order.deliveryDate.toLocaleDateString()}
        </h3>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 8px;">
          ⏰ Expected arrival time: 10:00 AM - 2:00 PM
        </p>
        ${order.deliveryMethod === "pickup"
          ? `
          <p style="color: #4b5563; font-size: 16px;">
            📍 Pickup location: 123 Main St, City
          </p>
        `
          : ""
        }
      </div>
      <p style="color: #4b5563; font-size: 16px; margin-top: 20px;">
        Need to make changes? 
        <a href="${process.env.APP_URL}/dashboard/orders/${order._id}" style="color: #2563eb; text-decoration: none;">
          Update your delivery preferences
        </a>
      </p>
      ${footerTemplate}
    </div>
  `,
};
