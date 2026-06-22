import { ticketPool } from "../../../../db.js";

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
        WHERE t.r_name = $1
        ORDER BY t.ticket_num DESC

      `,
      [d_name],
    );

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
    /*  console.log("BODY:", req.body);
    console.log("FILE:", req.file); */
    await client.query("BEGIN");

    const { userId, displayname, asset, faTag, subject, description } =
      req.body;

    const ticketNum = await getTicketNum(client);
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
