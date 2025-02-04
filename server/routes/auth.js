const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { body, validationResult } = require("express-validator");
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


router.put(
  "/me",
  authMiddleware,
  [
    body("name").optional().trim(),
    body("email").optional().isEmail(),
    body("address").optional().isObject(),
    body("address.street").optional().isString(),
    body("address.city").optional().isString(),
    body("address.state").optional().isString(),
    body("address.zip").optional().isString(),
    body("contactNumber").optional().isString(),
    body("dob").optional().isISO8601().toDate(),
  ],
  async (req, res) => {
    try {
      // Optional: check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).select("-password");
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: "Update failed" });
    }
  }
);

router.get("/profile", authMiddleware, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
