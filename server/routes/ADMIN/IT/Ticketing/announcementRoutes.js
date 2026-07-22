import express from "express";
import upload from "../../../../middleware/ADMIN/IT/Ticketing/uploadAnnouncement.js";

import {
  getAnnouncement,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../../../controllers/ADMIN/IT/Ticketing/announcementControllers.js";

const router = express.Router();

router.get("/", getAnnouncement);
router.get("/:id", getAnnouncementById);
router.post("/", upload.array("files"), createAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
