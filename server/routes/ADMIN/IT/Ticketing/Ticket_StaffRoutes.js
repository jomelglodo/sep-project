import express from "express";
import multer from "multer";

import {
  dashboardCounter,
  populateTickets,
  getAllTickets,
  getAttachment,
  startTroubleshoot,
  getAllAssignedTickets,
  finishTicket,
  getUpdateAttachment,
  saveUpdateChanges,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_StaffController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

//DASHBOARD

//POST
router.post("/getcounter", dashboardCounter);
router.post("/populatetickets", populateTickets);

//TICKET MANAGEMENT - ALL

//GET
router.get("/getalltickets", getAllTickets);
router.get("/getattachment/:ticketNum", getAttachment);

//PUT
router.put("/starttroubleshoot/:ticketNum", startTroubleshoot);
router.put(
  "/finishticket/:ticketNum",
  upload.single("attachment"),
  finishTicket,
);

//TICKET MANAGEMENT - ASSIGNED

//GET
router.get("/allassignedtickets/:staffName", getAllAssignedTickets);
router.get("/getupdateattachment/:ticketNum", getUpdateAttachment);

//PUT
router.put(
  "/saveeditdetails/:ticketNum",
  upload.single("attachment"),
  saveUpdateChanges,
);

export default router;
