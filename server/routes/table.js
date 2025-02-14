const express = require("express");
const Table = require("../models/Table.model");
const router = express.Router();

// GET all tables (auto-populates the table view)
router.get("/", async (req, res) => {
    try {
        const tables = await Table.find().sort({ tableNumber: 1 });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tables." });
    }
});

// POST a new table
router.post("/", async (req, res) => {
    try {
        const { tableNumber, maxCapacity } = req.body;
        if (!tableNumber || !maxCapacity) {
            return res.status(400).json({ message: "Table number and max capacity required." });
        }
        // Check if table already exists
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.status(400).json({ message: "Table number already exists." });
        }
        const newTable = new Table({ tableNumber, maxCapacity });
        await newTable.save();
        res.status(201).json(newTable);
    } catch (error) {
        res.status(500).json({ message: "Error creating table." });
    }
});

// DELETE a table by id
router.delete("/:id", async (req, res) => {
    try {
        const deletedTable = await Table.findByIdAndDelete(req.params.id);
        if (!deletedTable) {
            return res.status(404).json({ message: "Table not found." });
        }
        res.json({ message: "Table deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting table." });
    }
});


module.exports = router;
