const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create or Update a Stripe Product and Price
const syncMealPlanWithStripe = async (mealPlan) => {
    try {
        let product;

        if (mealPlan.stripePriceId) {
            // Fetch the existing product if it exists
            const existingPrice = await stripe.prices.retrieve(mealPlan.stripePriceId);
            product = await stripe.products.retrieve(existingPrice.product);
        } else {
            // Create a new product if it doesn't exist
            product = await stripe.products.create({
                name: mealPlan.name,
                description: mealPlan.description,
            });
        }

        // Create a new price for the product
        const price = await stripe.prices.create({
            unit_amount: Math.round(mealPlan.price * 100), // Price in cents
            currency: "usd",
            product: product.id,
            recurring: { interval: "week" },
        });

        return price.id;
    } catch (error) {
        console.error("Error syncing meal plan with Stripe:", error);
        throw error;
    }
};

module.exports = { syncMealPlanWithStripe };