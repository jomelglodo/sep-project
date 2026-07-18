import express from "express";
import { getSummaryReport } from "../../../../controllers/ADMIN/IT/Ticketing/reportingController.js";

const router = express.Router();

router.get("/summary", getSummaryReport);

export default router;
