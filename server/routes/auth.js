const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateToken } = require("../utils/jwt");
const { body, validationResult } = require("express-validator");
const { validateEmail, validatePassword } = require("../utils/validations");
const User = require("../models/User.model");
const { authMiddleware } = require("../middleware/auth");
const { sendEmail } = require("../services/email");
const emailTemplates = require("../emails/templates");

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
    console.log(error)
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
    console.log(error);
  }
});

/**
 * 1. Request Password Reset
 *    - User enters email
 *    - Generate reset token
 *    - Save token & expiry to user document or separate passwordReset model
 *    - Email user the link
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, respond with success but do not reveal user doesn't exist
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Token expiry in 1 hour
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    // Store token & expiry on the user doc 
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Password reset link (Adjust CLIENT_URL or some config)
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send email with a nice HTML template
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Hello ${user.name}, reset your password: ${resetLink}`,
      emailTemplates.passwordReset(user.name, resetLink)
    );

    return res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

/**
 * 2. Verify Token & Reset Password
 *    - Check token validity
 *    - Update user password
 *    - Clear reset token
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Find user by token & check expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },  // ensure token hasn't expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;


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
