// models/Reservation.js
import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = ('Reservation', ReservationSchema);