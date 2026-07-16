import express from "express";
import {
  getTicketDetails,
  getTicketAttachment,
} from "../../../../controllers/ADMIN/IT/Ticketing/ticketInspectorController.js";

const router = express.Router();

router.get("/:ticketId", getTicketDetails);

router.get("/attachment/:ticketId", getTicketAttachment);

export default router;
