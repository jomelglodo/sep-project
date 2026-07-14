/* import { ticketPool } from "../db.js"; */
import { getIO } from "../socket/socket.js";

export async function createNotification({
  client = ticketPool,
  recipientId = null,
  senderId = null,
  type,
  title,
  message,
  referenceId = null,
  referenceType = null,
}) {
  const result = await client.query(
    `
        INSERT INTO notifications(
        recipient_id,
        sender_id,
        notification_type,
        title,
        message,
        reference_id,
        reference_type
        )
        VALUES($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
    [recipientId, senderId, type, title, message, referenceId, referenceType],
  );

  const notification = result.rows[0];

  //  {#2d9,1}
  getIO().to(`user:${recipientId}`).emit("notification", notification);

  return notification;
}

export async function getNotifications(req, res) {}
