// models/CateringRequest.js
const mongoose = require('mongoose');

const CateringRequestSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        contactNumber: { type: String, required: true },
        eventDate: { type: Date, required: true },
        location: { type: String, required: true },
        message: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.models.CateringRequest ||
    mongoose.model('CateringRequest', CateringRequestSchema);
