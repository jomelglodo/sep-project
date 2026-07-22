import { ticketPool } from "../../../../db.js";
import { insertAnnouncement } from "../../../../services/ADMIN/IT/Ticketing/announcementServices.js";

export async function getAnnouncement(req, res) {
  res.json({
    success: true,
    message: "Announcement module is working.",
  });
}
export async function getAnnouncementById(req, res) {}

export async function createAnnouncement(req, res) {
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
export async function updateAnnouncement(req, res) {}
export async function deleteAnnouncement(req, res) {}
