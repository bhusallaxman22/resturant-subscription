// models/Newsletter.js
const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);
