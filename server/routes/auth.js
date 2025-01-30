const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { validateEmail, validatePassword } = require("../utils/validations");
const User = require("../models/User.model");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, contactNumber, dob } = req.body;

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      contactNumber,
      dob,
    });

    res.status(201).json({ token: generateToken(newUser), user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    res.json({ token: generateToken(user), user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in." });
  }
});


router.get("/profile", authMiddleware, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
