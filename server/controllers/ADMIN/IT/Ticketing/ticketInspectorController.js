import { ticketPool } from "../../../../db.js";

export const getTicketDetails = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const result = await ticketPool.query(
      `
        SELECT
            ticket_id,
            ticket_num,
            r_name,
            asset,
            asset_tag,
            subject_title,
            description,
            status,
            date_submitted,
            attachment_filename,
            attachment_mimetype,
            CASE
            WHEN attachment IS NOT NULL
            THEN CONCAT('/ticketing/inspector/attachment/',ticket_id)
            ELSE NULL 
            END as attachment_url
        FROM tbl_tickets
        WHERE ticket_id=$1
        `,
      [ticketId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }
    res.json({ success: true, ticket: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getTicketAttachment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const result = await ticketPool.query(
      `
      SELECT
      attachment,
      attachment_filename,
      attachment_mimetype
      FROM tbl_tickets
      WHERE ticket_id=$1
      `,
      [ticketId],
    );

    if (result.rows.length === 0) {
      return res.sendStatus(404);
    }

    const file = result.rows[0];

    if (!file.attachment) {
      return res.sendStatus(404);
    }

    res.setHeader("Content-Type", file.attachment_mimetype);

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.attachment_filename}"`,
    );

    res.send(file.attachment);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
