const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
    {
        tableNumber: { type: Number, required: true, unique: true },
        maxCapacity: { type: Number, required: true, min: 1 },
        // Reference to the Reservation that is currently using the table.
        assignedReservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Table", TableSchema);
