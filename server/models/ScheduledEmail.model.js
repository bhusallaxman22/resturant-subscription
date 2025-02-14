const mongoose = require("mongoose");

const ScheduledEmailSchema = new mongoose.Schema(
    {
        recipients: { type: [String], required: true }, // Array of recipient emails
        subject: { type: String, required: true },
        message: { type: String, required: true },
        scheduledAt: { type: Date, required: true }, // Date and time for sending the email
        sent: { type: Boolean, default: false }, // Status of email
        sentAt: { type: Date }, // Timestamp of when email was actually sent
    },
    { timestamps: true }
);

module.exports = mongoose.model("ScheduledEmail", ScheduledEmailSchema);
