import express from "express";

import {
  getSections,
  getStaff,
  getRisData,
  getCutOffStatus,
  getCutOffPassword,
  updateRisStatus,
  voidRis,
  showOngoingRis,
  voidSelectedRis,
  saveCheckAllRis,
  saveCreatedWorkbook,
} from "../../../../controllers/PPC/WAREHOUSE/RIS/Ris_ManagementController.js";

const router = express.Router();

router.get("/sections", getSections);
router.get("/staffs", getStaff);
router.get("/risData", getRisData);
router.get("/cutOffStatus", getCutOffStatus);
router.get("/ongoingRis", showOngoingRis);

router.post("/cutOffPassword", getCutOffPassword);
router.post("/updateRisStatus", updateRisStatus);
router.post("/voidAllRis", voidRis);
router.post("/voidSelectedRis", voidSelectedRis);

//SAVE RIS DATA
router.get("/checkAllRis", saveCheckAllRis);
router.post("/saveWorkbook", saveCreatedWorkbook);

export default router;
