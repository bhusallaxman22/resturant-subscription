import { body, validationResult } from "express-validator";
import User from "../models/User.model";
outer.put(
  "/me",
  auth(["user", "admin"]),
  [
    body("name").optional().trim(),
    body("email").optional().isEmail(),
    body("address").optional().isObject(),
  ],
  async (req, res) => {
    try {
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
