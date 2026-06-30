import { ticketPool } from "../../../../db.js";
//GET PROFILE IMAGE
export const getProfileImage = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await ticketPool.query(
      `
      SELECT 
        profile_image,
        profile_image_mimetype
      FROM "tbl_userAccounts"
      WHERE user_id = $1
      `,
      [userId],
    );
    /*     console.log("userId:", userId);
    console.log("rowCount:", result.rowCount);
    console.log(result.rows.length); */
    if (result.rows.length === 0) {
      return res.status(404).send("Image not Found");
    }

    const image = result.rows[0].profile_image;

    if (!image) {
      return res.status(404).send("No profile image");
    }

    res.set("Content-Type", result.rows[0].profile_image_mimetype);
    res.send(image);
  } catch (err) {
    console.error(err);
  }
};

//DASHBOARD COUNTER
export const countTicket = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await ticketPool.query(
      `
      SELECT
      COUNT(*) FILTER (WHERE user_id=$1)::integer AS total,
      COUNT(*) FILTER (WHERE user_id=$1 AND status = 'Open')::integer as open,
      COUNT(*) FILTER (WHERE user_id=$1 AND status = 'In Progress')::integer as inprogress,
      COUNT(*) FILTER (WHERE user_id=$1 AND status = 'Cancelled')::integer as cancelled,
      COUNT(*) FILTER (WHERE user_id=$1 AND status = 'Closed')::integer as closed
      FROM tbl_tickets
      `,
      [userId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//POPULATE TICKETS
export const populateTickets = async (req, res) => {
  try {
    const { d_name } = req.body;
    const response = await ticketPool.query(
      `
        SELECT 
          t.ticket_num AS ticket_num_ticket,
          t.r_name,
          TO_CHAR(t.date_submitted, 'YYYY-MM-DD HH24:MI:SS') as d_submitted,
          t.asset,
          t.asset_tag,
          t.subject_title,
          t.description,
          CASE 
            WHEN attachment IS NOT NULL THEN TRUE 
            ELSE FALSE
          END as has_attachment,
          t.attachment_filename,
          t.attachment_mimetype,
          t.status,
          u.ticket_num,
          u.staff_name,
          TO_CHAR(u.time_started,'YYYY-MM-DD HH24:MI:SS') as t_started,
          TO_CHAR(u.time_finished,'YYYY-MM-DD HH24:MI:SS') as t_finished
        FROM tbl_tickets t
        LEFT JOIN tbl_ticket_updates u
          ON t.ticket_num = u.ticket_num
        WHERE t.r_name = $1
        ORDER BY 
          CASE t.status
            WHEN 'In Progress' THEN 1
            WHEN 'Open' THEN 2
            WHEN 'Closed' THEN 3
            WHEN 'Cancelled' THEN 4
            ELSE 5
          END,
          t.ticket_num DESC

      `,
      [d_name],
    );

    res.json(response.rows);
  } catch (err) {
    console.error(err);
  }
};

//GET IMAGE OF THE SELECTED TICKET NUM
export const getTicketImage = async (req, res) => {
  try {
    const { selectedTicketNum } = req.params;

    const result = await ticketPool.query(
      `
      SELECT 
      attachment,
      attachment_filename,
      attachment_mimetype
      FROM tbl_tickets
      WHERE ticket_num = $1
      `,
      [selectedTicketNum],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const ticket = result.rows[0];

    if (!ticket.attachment) {
      return res.status(404).json({
        success: false,
        message: "No image attached",
      });
    }

    res.setHeader("Content-Type", ticket.attachment_mimetype);

    return res.send(ticket.attachment);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
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

//GET TICKETNUMBER
async function getTicketNum(client) {
  const curYear = new Date().getFullYear();
  const shortYear = curYear.toString().slice(-2);

  //Lock the row for this year
  const counterResult = await client.query(
    `
    SELECT last_number
    FROM tbl_ticket_counter
    WHERE ticket_year =$1
    FOR UPDATE
    `,
    [curYear],
  );

  let nextNumber;
  if (counterResult.rows.length === 0) {
    //first ticket of the year
    nextNumber = 1;
    await client.query(
      `
        INSERT INTO tbl_ticket_counter(ticket_year, last_number)
        VALUES ($1,$2)
      `,
      [curYear, nextNumber],
    );
  } else {
    nextNumber = counterResult.rows[0].last_number + 1;

    await client.query(
      `
      UPDATE tbl_ticket_counter
      SET last_number =$1
      WHERE ticket_year=$2
      `,
      [nextNumber, curYear],
    );
  }

  return `IT${shortYear}-${String(nextNumber).padStart(6, "0")}`;
}

//CREATE TICKET
export const createTicket = async (req, res) => {
  const client = await ticketPool.connect();

  try {
    /* console.log("BODY:", req.body);
    console.log("FILE:", req.file); */
    await client.query("BEGIN");

    const { userId, displayname, asset, faTag, subject, description } =
      req.body;

    const ticketNum = await getTicketNum(client);

    //for single image
    const imageBuffer = req.file ? req.file.buffer : null;
    const filename = req.file ? req.file.originalname : null;
    const mimeType = req.file ? req.file.mimetype : null;

    //const files = req.files || [];
    //for multiple image
    // const imageBuffer = files.length > 0 ? files[0].buffer : null;
    // const filename = files.length > 0 ? files[0].originalname : "null";

    await ticketPool.query(
      `
        INSERT INTO tbl_tickets(
        ticket_num,
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
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `,
      [
        ticketNum,
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
    await client.query("COMMIT");

    res.json({
      success: true,
      ticketNum,
      message: "Ticket successfully created",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    client.release();
  }
};
// UPDATE TICKET
export const updateTicket = async (req, res) => {
  const { selectedTicketNum } = req.params;
  const { asset, faTag, subject, description } = req.body;

  //image attachment
  const imageBuffer = req.file ? req.file.buffer : null;
  const filename = req.file ? req.file.originalname : null;
  const mimeType = req.file ? req.file.mimetype : null;

  try {
    let result;
    if (!req.file) {
      result = await ticketPool.query(
        `
      UPDATE tbl_tickets
      SET asset = $1, asset_tag = $2, subject_title = $3, description = $4
      WHERE ticket_num = $5
      `,
        [asset, faTag, subject, description, selectedTicketNum],
      );
    } else {
      result = await ticketPool.query(
        `
        UPDATE tbl_tickets
        SET 
          asset = $1, 
          asset_tag = $2,
          subject_title = $3, 
          description = $4,
          attachment =$5,
          attachment_filename =$6,
          attachment_mimetype = $7
        WHERE ticket_num = $8
        `,
        [
          asset,
          faTag,
          subject,
          description,
          imageBuffer,
          filename,
          mimeType,
          selectedTicketNum,
        ],
      );
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket successfully updated",
    });
  } catch (err) {
    console.err(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// CANCEL TICKET

export const cancelTicket = async (req, res) => {
  const { selTicketNum } = req.params;

  try {
    const result = await ticketPool.query(
      `UPDATE tbl_tickets SET status='Cancelled' WHERE ticket_num = $1`,
      [selTicketNum],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Ticket successfully updated" });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
