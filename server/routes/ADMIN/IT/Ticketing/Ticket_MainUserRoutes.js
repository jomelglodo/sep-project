import express from "express";
import {
  countTicket,
  populateTickets,
  getTicketImage,
  populateAsset,
  createTicket,
  cancelTicket,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_MainUserControllers.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

//TICKET TAB
//POST
//multiple image attachment
//router.post("/createticket", upload.array("attachments", 10), createTicket);
//single image attachment
router.post("/ticket/createticket", upload.single("attachment"), createTicket);
router.post("/ticket/gettickets", populateTickets);

//PUT
router.put("/ticket/cancelticket/:selTicketNum", cancelTicket);

//GET
router.get("/ticket/getassets", populateAsset);
router.get("/ticket/getticketimage/:selectedTicketNum", getTicketImage);

//DASHBOARD TAB
router.get("/ticket/countticket/:userId", countTicket);

export default router;
