import { ticketPool } from "../../../../db.js";
import {
  getAnnouncementsService,
  insertAnnouncement,
  updateAnnouncementService,
  deleteAnnouncementService,
  toggleAnnouncementPublishService,
  toggleAnnouncementPinService,
  getUserAnnouncementsService,
  getUserAnnouncementByIdService,
  downloadAnnouncementFileService,
} from "../../../../services/ADMIN/IT/Ticketing/announcementServices.js";

//ADMIN
export async function getAnnouncements(req, res) {
  try {
    const data = await getAnnouncementsService(req.query);

    res.json({
      success: true,
      announcements: data.announcements,
      pagination: data.pagination,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load announcements",
    });
  }
}

export async function getAnnouncementById(req, res) {}

export async function createAnnouncement(req, res) {
  const { title, category, content } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  if (!category?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category is required",
    });
  }

  if (!content?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  try {
    const announcement = await insertAnnouncement({
      body: req.body,
      files: req.files,
    });
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
    });
  }
}

export async function updateAnnouncement(req, res) {
  try {
    const announcementId = Number(req.params.announcementId);

    await updateAnnouncementService({
      announcementId,
      body: req.body,
      files: req.files ?? [],
    });

    res.json({
      success: true,
      message: "Announcement updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const announcementId = Number(req.params.announcementId);

    await deleteAnnouncementService(announcementId);

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function toggleAnnouncementPublish(req, res) {
  try {
    const announcementId = Number(req.params.announcementId);
    await toggleAnnouncementPublishService(announcementId);

    res.json({
      success: true,
      message: "Announcement status updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function toggleAnnouncementPin(req, res) {
  try {
    const announcementId = Number(req.params.announcementId);

    await toggleAnnouncementPinService(announcementId);

    res.json({
      success: true,
      message: "Announcement pin status updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

//USERS

export async function getUserAnnouncements(req, res) {
  try {
    const announcements = await getUserAnnouncementsService(req.query);

    res.json({
      success: true,
      announcements,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to load announcements.",
    });
  }
}

export async function getUserAnnouncementById(req, res) {
  try {
    const announcementId = Number(req.params.announcementId);

    const announcement = await getUserAnnouncementByIdService(announcementId);
    res.json({
      success: true,
      announcement,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load announcement..",
    });
  }
}

//download attachment file
export async function downloadAnnouncementFile(req, res) {
  try {
    const fileId = Number(req.params.fileId);

    const file = await downloadAnnouncementFileService(fileId);

    res.setHeader("Content-Type", file.file_type);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.original_filename}"`,
    );

    res.send(file.file_data);
  } catch (err) {
    console.error(err);

    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

//preview attachment file
export async function previewAttachmentFile(req, res) {
  try {
    const fileId = Number(req.params.fileId);
    const file = await downloadAnnouncementFileService(fileId);
    res.setHeader("Content-Type", file.file_type);

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.original_filename}"`,
    );

    res.send(file.file_data);
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}
