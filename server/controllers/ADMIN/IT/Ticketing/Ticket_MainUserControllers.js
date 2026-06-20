import { ticketPool } from "../../../../db.js";

//POPULATE TICKETS
export const populateTickets = async (req, res) => {
  try {
    const response = await ticketPool.query(`
        SELECT 
          t.ticket_num AS ticket_num_ticket,
          t.date_submitted,
          t.subject_title,
          t.status,
          u.ticket_num,
          u.staff_name,
          u.time_started,
          u.time_finished
        FROM tbl_tickets t
        LEFT JOIN tbl_ticket_updates u
          ON t.ticket_num = u.ticket_num
        ORDER BY t.ticket_num DESC

      `);
    res.json(response.rows);
  } catch (err) {
    console.error(err);
  }
};

//POPULATE ASSET
export const populateAsset = async (req, res) => {
  try {
    const response = await ticketPool.query(`
        SELECT asset 
        FROM tbl_asset
        ORDER BY asset ASC
      `);

    res.json(response.rows);
  } catch (err) {
    console.error(err);
    res.json({ message: "Server Error" });
  }
};

//CREATE TICKET
export const createTicket = async (req, res) => {
  try {
    /* console.log("BODY:", req.body);
    console.log("FILE:", req.file); */

    const { userId, displayname, asset, faTag, subject, description } =
      req.body;

    //for single image
    const imageBuffer = req.file ? req.file.buffer : null;
    const filename = req.file ? req.file.originalname : null;
    const mimeType = req.file ? req.file.mimeType : null;

    //const files = req.files || [];
    //for multiple image
    // const imageBuffer = files.length > 0 ? files[0].buffer : null;
    // const filename = files.length > 0 ? files[0].originalname : "null";

    await ticketPool.query(
      `
        INSERT INTO tbl_tickets(
        user_id,
        r_name,
        asset,
        asset_tag,
        subject_title,
        description,
        attachment,
        attachment_filename,
        attachment_mimetype
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
        `,
      [
        userId,
        displayname,
        asset,
        faTag,
        subject,
        description,
        imageBuffer,
        filename,
        mimeType,
      ],
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
