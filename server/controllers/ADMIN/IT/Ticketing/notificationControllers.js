import { ticketPool } from "../../../../db.js";

//get notifications
export const getNotification = async (req, res) => {
  const { userId } = req.params;

  const result = await ticketPool.query(
    `
        SELECT *
        FROM notifications
        WHERE recipient_id=$1
        ORDER BY created_at DESC
        LIMIT 50
        `,
    [userId],
  );

  res.json(result.rows);
};

//mark as read
export const markRead = async (req, res) => {
  const { id } = req.params;

  await ticketPool.query(
    `
        UPDATE notifications
        SET is_read=true
        WHERE notification_id=$1
        `,
    [id],
  );

  res.json({ success: true });
};

//mark all as read
export const markAllRead = async (req, res) => {
  const { userId } = req.params;

  await ticketPool.query(
    `
        UPDATE notifications
        SET is_read=true
        WHERE recipient_id=$1
        `,
    [userId],
  );

  res.json({ success: true });
};
