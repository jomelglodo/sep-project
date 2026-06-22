import express from "express";
import {
  countTicket,
  populateTickets,
  populateAsset,
  createTicket,
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

//GET
router.get("/ticket/getassets", populateAsset);

//DASHBOARD TAB
router.get("/ticket/countticket/:userId", countTicket);

export default router;
