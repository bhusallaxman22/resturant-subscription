const express = require("express");
const Newsletter = require("../models/Newsletter.model");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { sendEmail } = require("../services/email");
const { emailTemplates } = require("../emails/templates");
const ScheduledEmail = require("../models/ScheduledEmail.model");
const cron = require("node-cron");
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

// Store & manage past emails
router.get("/past-emails", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pastEmails = await ScheduledEmail.find({ sent: true }).sort({ sentAt: -1 });
        res.json(pastEmails);
    } catch (error) {
        console.error("Error retrieving past emails:", error);
        res.status(500).json({ message: "Error fetching past emails." });
    }
});

// Get scheduled emails
router.get("/scheduled-emails", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const scheduledEmails = await ScheduledEmail.find({ sent: false }).sort({ scheduledAt: 1 });
        res.json(scheduledEmails);
    } catch (error) {
        console.error("Error retrieving scheduled emails:", error);
        res.status(500).json({ message: "Error fetching scheduled emails." });
    }
});

// Send email or schedule for future delivery
router.post("/send-email", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { recipients, subject, message, schedule } = req.body;
        let emails = [];

        if (recipients === "all") {
            const subscribers = await Newsletter.find();
            emails = subscribers.map(sub => sub.email);
        } else if (Array.isArray(recipients)) {
            emails = recipients;
        } else if (typeof recipients === "string" && recipients.includes("@")) {
            emails = [recipients];
        }

        if (emails.length === 0) {
            return res.status(400).json({ message: "No valid email recipients found." });
        }

        if (schedule) {
            // Save to database for scheduling
            const scheduledEmail = new ScheduledEmail({
                recipients: emails,
                subject,
                message,
                scheduledAt: new Date(schedule),
                sent: false,
            });
            await scheduledEmail.save();
            return res.json({ message: "Email scheduled successfully!" });
        } else {
            // Send email immediately
            for (let email of emails) {
                const emailContent = emailTemplates.newsletterEmail(subject, message);
                await sendEmail(email, subject, message, emailContent);
            }

            // Store sent email in history
            await ScheduledEmail.create({ recipients: emails, subject, message, sent: true, sentAt: new Date() });

            return res.json({ message: `Emails sent to ${emails.length} recipients.` });
        }
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ message: "Error sending emails." });
    }
});

// Run background job every minute to send scheduled emails
cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();
        const emailsToSend = await ScheduledEmail.find({ sent: false, scheduledAt: { $lte: now } });

        for (const email of emailsToSend) {
            for (const recipient of email.recipients) {
                const emailContent = emailTemplates.newsletterEmail(email.subject, email.message);
                await sendEmail(recipient, email.subject, email.message, emailContent);
            }

            email.sent = true;
            email.sentAt = new Date();
            await email.save();
        }
    } catch (error) {
        console.error("Error sending scheduled emails:", error);
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
