const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true }, // Expected format: "HH:mm"
        numberOfPeople: { type: Number, required: true, min: 1 },
        tableNumber: { type: Number, default: null },
        // New field: assignment expires 2 hours after reservation's start time
        tableAssignmentExpiresAt: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reservation", ReservationSchema);
