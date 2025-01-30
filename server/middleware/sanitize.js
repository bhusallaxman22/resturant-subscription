import { body, sanitizeBody } from "express-validator";

export const sanitizeInput = [
  body("*").escape(),
  sanitizeBody("*").trim(),
  (req, res, next) => {
    // Deep sanitize all request bodies
    const sanitize = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        } else if (typeof obj[key] === "object") {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
    next();
  },
];
