import { ticketPool } from "../../../../db.js";
import { getIO } from "../../../../socket/socket.js";

export async function createTimelineEvent({
  client = ticketPool,
  ticketId,
  performedBy = null,
  eventType,
  message,
}) {
  try {
    const result = await client.query(
      `
        INSERT INTO tbl_ticket_timeline(
            ticket_id,
            performed_by,
            event_type,
            message
        ) VALUES ($1,$2,$3,$4) RETURNING *
        `,
      [ticketId, performedBy, eventType, message],
    );

    const timeline = result.rows[0];

    //get performer display ame
    let performerName = null;

    if (performedBy) {
      const user = await client.query(
        `
        SELECT
          d_name
        FROM "tbl_userAccounts"
        where user_id =$1
        `,
        [performedBy],
      );

      performerName = user.rows[0]?.d_name ?? null;
    }

    const payload = { ...timeline, performed_by: performerName };

    //  {#f8e,2}
    //emit to everyone currently viewing this ticket
    getIO().to(`ticket:${ticketId}`).emit("timeline-update", payload);

    return payload;
  } catch (err) {
    console.error(err);
  }
}
