import express from "express";

import {
  dashboardCounter,
  populateTickets,
  getAllTickets,
  getAttachment,
  startTroubleshoot,
  getAllAssignedTickets,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_StaffController.js";

const router = express.Router();

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

//TICKET MANAGEMENT - ASSIGNED

//GET
router.get("/allassignedtickets/:staffName", getAllAssignedTickets);

export default router;
