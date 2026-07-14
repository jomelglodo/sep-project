import express from "express";

import {
  getNotification,
  markRead,
  markAllRead,
} from "../../../../controllers/ADMIN/IT/Ticketing/notificationControllers.js";

const router = express.Router();

router.get("/:userId", getNotification);

router.put("/:id/read", markRead);

router.put("/:userId/read-all", markAllRead);

export default router;
