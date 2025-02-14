const express = require("express");
const CateringRequest = require("../models/CateringRequest.model");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { sendEmail } = require("../services/email");

const router = express.Router();

// Submit a catering request
router.post("/", async (req, res) => {
    try {
        const request = new CateringRequest(req.body);
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: "Error submitting request." });
        console.log(error);
    }
});

// Get all catering requests (Admin)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const requests = await CateringRequest.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving requests." });
        console.error("Error fetching catering requests:", error);
    }
});

// Reply to a catering request
router.post("/:id/reply", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const request = await CateringRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found." });

        const { subject, message } = req.body;
        await sendEmail(request.email, subject, message, `<p>${message}</p>`);
        res.json({ message: "Reply sent successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error sending reply." });
    }
});

module.exports = router;
