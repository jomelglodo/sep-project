import express from "express";
import {
  accountValidation,
  refreshAccessToken,
  logout,
  updatePassword,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_LoginControllers.js";

const router = express.Router();

//POST
router.post("/validation", accountValidation);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.post("/updatepassword", updatePassword);

export default router;
