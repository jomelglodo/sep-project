import express from "express";
import {
  getSections,
  getCutOffStatus,
  getCurrentYear,
  generateRIS,
} from "../../../../controllers/PPC/WAREHOUSE/RIS/RisController.js";

const router = express.Router();

router.get("/sections", getSections);
router.get("/cutoffstatus", getCutOffStatus);
router.get("/db-year", getCurrentYear);
router.post("/generate-ris", generateRIS);

export default router;
