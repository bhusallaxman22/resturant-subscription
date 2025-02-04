import { body, validationResult } from "express-validator";
import User from "../models/User.model";
import auth from "../middleware/authMiddleware"; // Or wherever your auth function is

router.put(
  "/me",
  auth(["user", "admin"]),
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
