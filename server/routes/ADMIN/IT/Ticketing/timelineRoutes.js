import express from "express";
import { getTicketTimeline } from "../../../../controllers/ADMIN/IT/Ticketing/timelineController.js";

const router = express.Router();

router.get("/:ticketId", getTicketTimeline);

export default router;
