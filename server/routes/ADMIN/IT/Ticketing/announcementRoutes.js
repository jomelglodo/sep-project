import express from "express";

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
router.post("/", createAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
