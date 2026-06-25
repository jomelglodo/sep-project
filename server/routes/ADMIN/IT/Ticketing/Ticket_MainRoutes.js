import express from "express";

import {
  getDeparments,
  getProfileData,
  getProfileImage,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_MainControllers.js";

import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

//GET
router.get("/getdepartments", getDeparments);
router.get("/profiledata/:userId", getProfileData);
router.get("/profileimage/:userId", getProfileImage);

export default router;
