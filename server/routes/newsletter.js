const express = require("express");
const Newsletter = require("../models/Newsletter.model");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { sendEmail } = require("../services/email");
const emailTemplates = require("../emails/templates");

const router = express.Router();

// Subscribe to newsletter
router.post("/", async (req, res) => {
    try {
        const { name, email } = req.body;
        const existing = await Newsletter.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already subscribed." });

        const subscriber = new Newsletter({ name, email });
        await subscriber.save();

        // Send welcome email
        const emailContent = emailTemplates.welcomeEmail(name);
        await sendEmail(email, "Welcome to Saffron Kitchen!", emailContent, emailContent);

        res.status(201).json(subscriber);
    } catch (error) {
        res.status(500).json({ message: "Error subscribing." });
        console.error("Error subscribing to newsletter:", error);
    }
});


// Get all newsletter subscribers (Admin)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const subscribers = await Newsletter.find();
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving subscribers." });
    }
});

// Send email to individual or all subscribers
router.post("/send-email", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { recipients, subject, message } = req.body;
        let emails = [];

        if (recipients === "all") {
            const subscribers = await Newsletter.find();
            emails = subscribers.map(sub => sub.email);
        } else if (Array.isArray(recipients)) {
            emails = recipients; // Handle multiple specific recipients
        } else if (typeof recipients === "string" && recipients.includes("@")) {
            emails = [recipients]; // Handle single recipient as a string
        }

        // **Fix: Ensure there are recipients before sending**
        if (emails.length === 0) {
            return res.status(400).json({ message: "No valid email recipients found." });
        }

        // Send email to each recipient
        for (let email of emails) {
            // use template
            const emailContent = emailTemplates.newsletterEmail(subject, message);
            await sendEmail(email, subject, message, emailContent);
        }

        res.json({ message: `Emails sent to ${emails.length} recipients.` });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ message: "Error sending emails." });
    }
});

// Unsubscribe a user
router.post("/unsubscribe", async (req, res) => {
    try {
        const { email } = req.body;

        const subscriber = await Newsletter.findOne({ email });
        if (!subscriber) {
            return res.status(404).json({ message: "Email not found in our newsletter list." });
        }

        await Newsletter.deleteOne({ email });

        res.json({ message: "You have been unsubscribed successfully." });
    } catch (error) {
        console.error("Error unsubscribing user:", error);
        res.status(500).json({ message: "Error unsubscribing." });
    }
});




module.exports = router;
