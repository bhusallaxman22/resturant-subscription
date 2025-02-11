const express = require("express");
const Reservation = require("../models/Reservation");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Make a reservation
router.post("/", async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Error making reservation." });
    }
});

// Get all reservations (Admin)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving reservations." });
    }
});

module.exports = router;
