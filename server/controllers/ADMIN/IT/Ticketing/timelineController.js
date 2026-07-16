import { ticketPool } from "../../../../db.js";

export async function getTicketTimeline(req, res) {
  try {
    const { ticketId } = req.params;

    const result = await ticketPool.query(
      `
        SELECT
            tt.timeline_id,
            tt.ticket_id,
            tt.event_type,
            tt.message,
            tt.created_at,
            ua.d_name AS performed_by
        FROM tbl_ticket_timeline tt
            LEFT JOIN "tbl_userAccounts" ua
            ON ua.user_id = tt.performed_by
            WHERE tt.ticket_id = $1
            ORDER BY tt.created_at ASC
            `,
      [ticketId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to load timeline",
    });
  }
}
