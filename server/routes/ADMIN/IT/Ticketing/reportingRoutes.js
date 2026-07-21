import express from "express";
import {
  getSummaryReport,
  getTicketHistory,
  getReportingLookups,
  exportTicketHistory,
} from "../../../../controllers/ADMIN/IT/Ticketing/reportingController.js";

const router = express.Router();

//TICKET SUMMARY
router.get("/summary", getSummaryReport);

//TICKET HISTORY
router.get("/history", getTicketHistory);
router.get("/lookups", getReportingLookups);
router.get("/export", exportTicketHistory);

export default router;
