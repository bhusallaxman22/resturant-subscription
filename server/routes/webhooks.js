import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "invoice.payment_succeeded":
        await handleSuccessfulPayment(event.data.object);
        break;
      case "customer.subscription.deleted":
        await cancelSubscription(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
