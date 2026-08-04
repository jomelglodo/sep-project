// middleware/ticketAuth.js

import jwt from "jsonwebtoken";

export function verifyTicketUser(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Login required.",
      });
    }

    const token = auth.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired.",
    });
  }
}
