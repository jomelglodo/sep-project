import express from "express";
import {
  accountValidation,
  updatePassword,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_LoginControllers.js";

const router = express.Router();

//POST
router.post("/validation", accountValidation);
router.post("/updatepassword", updatePassword);

export default router;
