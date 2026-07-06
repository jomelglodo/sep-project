import express from "express";
import { userCounter } from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_AdminControllers.js";

const router = express.Router();

router.get("/usercounter", userCounter);

export default router;
