import express from "express";

import {
  dashboardCounter,
  populateTickets,
  getAllTickets,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_StaffController.js";

const router = express.Router();

//DASHBOARD

//POST
router.post("/getcounter", dashboardCounter);
router.post("/populatetickets", populateTickets);

//TICKET MANAGEMENT

//GET
router.get("/getalltickets", getAllTickets);

export default router;
