import express from "express";
import upload from "../../../../middleware/ADMIN/IT/Ticketing/uploadAnnouncement.js";

import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementPublish,
  toggleAnnouncementPin,
  getUserAnnouncements,
  getUserAnnouncementById,
  downloadAnnouncementFile,
  previewAttachmentFile,
  getAnnouncementDashboard,
  getAnnouncementCategorySummary,
  getRecentAnnouncements,
} from "../../../../controllers/ADMIN/IT/Ticketing/announcementControllers.js";

const router = express.Router();

//user
router.get("/user", getUserAnnouncements);
router.get("/user/:announcementId", getUserAnnouncementById);
router.get("/file/:fileId", downloadAnnouncementFile);
router.get("/file/:fileId/preview", previewAttachmentFile);

//dashboard
router.get("/dashboard", getAnnouncementDashboard);
router.get("/dashboard/categories", getAnnouncementCategorySummary);
router.get("/dashboard/recent", getRecentAnnouncements);

//admin
router.get("/", getAnnouncements);
router.get("/:id", getAnnouncementById);
router.post("/", upload.array("files"), createAnnouncement);
router.put("/:announcementId", upload.array("files"), updateAnnouncement);
router.delete("/:announcementId", deleteAnnouncement);
router.patch("/:announcementId/publish", toggleAnnouncementPublish);
router.patch("/:announcementId/pin", toggleAnnouncementPin);

export default router;
