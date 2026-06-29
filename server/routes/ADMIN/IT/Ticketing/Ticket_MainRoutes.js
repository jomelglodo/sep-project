import express from "express";

import {
  updatePassword,
  passValidation,
  getDeparments,
  getProfileData,
  getProfileImage,
  applyChanges,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_MainControllers.js";

import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

//CHANGE PASSWORD
//POST
router.post("/validation", passValidation);

//PUT
router.put("/updatepassword/:userId", updatePassword);

//UPDATE PROFILE

//GET
router.get("/getdepartments", getDeparments);
router.get("/profiledata/:userId", getProfileData);
router.get("/profileimage/:userId", getProfileImage);

//PUT
router.put("/applychanges/:userId", upload.single("attachment"), applyChanges);

export default router;
