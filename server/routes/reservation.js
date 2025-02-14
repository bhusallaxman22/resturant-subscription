const express = require("express");
const Reservation = require("../models/Reservation.model");
const Table = require("../models/Table.model");

const router = express.Router();

// Given a reservation date and time (as "HH:mm"), returns the reservation DateTime and expiry DateTime.
function getReservationAndExpiry(dateInput, timeInput) {
    // Create a Date object from the date input
    const reservationDate = new Date(dateInput);
    // Assume timeInput is in "HH:mm" format
    const [hours, minutes] = timeInput.split(":").map(Number);
    reservationDate.setHours(hours, minutes, 0, 0);

    // Expiry is 2 hours after the reservation start
    const expiryDate = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);

    return { reservationDateTime: reservationDate, expiryDateTime: expiryDate };
}


// Create a new reservation with automatic table assignment if available.
router.post("/", async (req, res) => {
    try {
        const { name, email, date, time, numberOfPeople } = req.body;
        if (!name || !email || !date || !time || !numberOfPeople) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create the reservation without table assignment.
        const newReservation = new Reservation({
            name,
            email,
            date,
            time,
            numberOfPeople,
            tableNumber: null,
            tableAssignmentExpiresAt: null,
        });
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "Error creating reservation." });
    }
});

// ✅ Get all reservations
router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1, time: 1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservations." });
    }
});

// ✅ Edit a reservation
router.put("/:id", async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: "Error updating reservation." });
    }
});

// ✅ Delete a reservation
router.delete("/:id", async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found." });
        }

        // If a table is assigned, free it
        if (reservation.tableNumber) {
            const table = await Table.findOne({ tableNumber: reservation.tableNumber });
            if (table) {
                table.assignedReservation = null;
                await table.save();
            }
        }

        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: "Reservation deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reservation." });
    }
});

// ✅ Assign a reservation to a table

// In your reservationRoutes.js (or similar file)
router.put("/assign-table/:id", async (req, res) => {
    try {
        const { tableNumber } = req.body;

        // Find the new table and populate any assigned reservation.
        let newTable = await Table.findOne({ tableNumber }).populate("assignedReservation");
        if (!newTable) {
            return res.status(400).json({ message: "Table not found." });
        }

        // Get the reservation details.
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found." });
        }

        // Check if the table's capacity is sufficient.
        if (reservation.numberOfPeople > newTable.maxCapacity) {
            return res.status(400).json({ message: "Table capacity is less than the number of people in the reservation." });
        }

        // If the table is assigned, check if its assignment has expired.
        if (newTable.assignedReservation) {
            if (newTable.assignedReservation.tableAssignmentExpiresAt && new Date(newTable.assignedReservation.tableAssignmentExpiresAt) >= new Date()) {
                // Table is still occupied.
                return res.status(400).json({ message: "Table not available." });
            } else {
                // Assignment expired; clear it.
                newTable.assignedReservation = null;
                await newTable.save();
            }
        }

        // If the reservation is already assigned to a different table, clear that assignment.
        if (reservation.tableNumber && reservation.tableNumber !== tableNumber) {
            const oldTable = await Table.findOne({ tableNumber: reservation.tableNumber });
            if (oldTable) {
                oldTable.assignedReservation = null;
                await oldTable.save();
            }
        }

        // Calculate the expiry time for the new assignment.
        const { reservationDateTime, expiryDateTime } = getReservationAndExpiry(reservation.date, reservation.time);

        // Update the reservation with the new table assignment and expiry.
        reservation.tableNumber = tableNumber;
        reservation.tableAssignmentExpiresAt = expiryDateTime;
        await reservation.save();

        // Update the new table to reflect the assignment.
        newTable.assignedReservation = reservation._id;
        await newTable.save();

        res.json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error assigning table." });
    }
});

// ✅ Unassign a table from a reservation
router.put("/unassign-table/:id", async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found." });
        }
        const table = await Table.findOne({ tableNumber: reservation.tableNumber });
        if (table) {
            table.assignedReservation = null;
            await table.save();
        }
        reservation.tableNumber = null;
        reservation.tableAssignmentExpiresAt = null;
        await reservation.save();
        res.json({ message: "Table unassigned successfully.", reservation });
    } catch (error) {
        res.status(500).json({ message: "Error unassigning table." });
    }
});


module.exports = router;
