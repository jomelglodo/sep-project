import { ticketPool } from "../../../../db.js";

export async function getAnnouncement(req, res) {
  res.json({
    success: true,
    message: "Announcement module is working.",
  });
}
export async function getAnnouncementById(req, res) {}
export async function createAnnouncement(req, res) {}
export async function updateAnnouncement(req, res) {}
export async function deleteAnnouncement(req, res) {}
