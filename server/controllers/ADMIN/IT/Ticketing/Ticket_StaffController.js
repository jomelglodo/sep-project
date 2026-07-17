import { response } from "express";
import { ticketPool } from "../../../../db.js";
import { getIO } from "../../../../socket/socket.js";
//DASHBOARD ---------------------------------------------------------------------------

import { createNotification } from "../../../../services/notificationService.js";
import { createTimelineEvent } from "../../../../services/ADMIN/IT/Ticketing/timelineService.js";
import { TIMELINE_EVENTS } from "../../../../constants/ADMIN/IT/Ticketing/timelineEvents.js";

//DASHBOARD COUNTER
export const dashboardCounter = async (req, res) => {
  const { staffName } = req.body;
  const statuses = ["Open", "In Progress", "Closed", "Cancelled"];
  const inClause = statuses.map((status) => `'${status}'`).join(",");

  try {
    const result = await ticketPool.query(
      `
        SELECT t.status, COUNT(*) as total
        FROM tbl_tickets t
        INNER JOIN tbl_ticket_updates u
            on t.ticket_id = u.ticket_id
        WHERE
            t.status IN ( ${inClause})
            AND u.staff_name = $1
        GROUP BY t.status
        ORDER BY t.status
        `,
      [staffName],
    );

    const counts = {
      total: 0,
      open: 0,
      inprogress: 0,
      cancelled: 0,
      closed: 0,
    };

    result.rows.forEach((row) => {
      const total = Number(row.total);

      switch (row.status.toLowerCase().trim()) {
        case "open":
          counts.open = total;
          break;

        case "in progress":
          counts.inprogress = total;
          break;

        case "closed":
          counts.closed = total;
          break;

        case "cancelled":
          counts.cancelled = total;
          break;
      }

      counts.total += total;
    });

    res.json({ success: true, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const populateTickets = async (req, res) => {
  const { staffName } = req.body;
  try {
    const result = await ticketPool.query(
      `
            SELECT
                t.ticket_id,
                t.ticket_num,
                t.r_name,
                t.date_submitted,
                t.subject_title,
                t.status,
                u.ticket_id,
                u.staff_name
            FROM tbl_tickets t
            INNER JOIN tbl_ticket_updates u
                ON t.ticket_id=u.ticket_id
            WHERE u.staff_name = $1
            ORDER BY
                CASE WHEN status = 'In Progress' THEN 0 ELSE 1 END,
                t.ticket_num DESC
        `,
      [staffName],
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//TICKET MANAGEMENT - ALL
//populate tickets
export const getAllTickets = async (req, res) => {
  const { search = "", status = "all" } = req.query;

  try {
    const values = [];
    let where = [];

    //Status Filter
    if (status !== "all") {
      values.push(status);
      where.push(`status=$${values.length}`);
    } else {
      values.push(["Open", "In Progress"]);
      where.push(`status=ANY($${values.length}::ticket_status[])`);
    }

    //Search Filter
    if (search.trim() !== "") {
      values.push(`%${search}%`);

      where.push(`(
            ticket_num ILIKE $${values.length}
            OR subject_title ILIKE $${values.length}
            OR r_name ILIKE $${values.length}
            )`);
    }
    /*  console.log(where);
    console.log(values); */

    const result = await ticketPool.query(
      `
        SELECT
            ticket_id,
            ticket_num,
            TO_CHAR(date_submitted,'YYYY-MM-DD HH24:MI:SS') as d_submitted,
            r_name,
            subject_title,
            description,
            asset_tag,
            CASE 
              WHEN attachment IS NOT NULL THEN TRUE
              ELSE FALSE
            END AS has_attachment,
            status
        FROM tbl_tickets
        WHERE ${where.join(" AND ")}
        ORDER BY
            CASE status
                WHEN 'In Progress' THEN 1
                WHEN 'Open' THEN 2
                ELSE 3
            END,
            ticket_num DESC,
            date_submitted DESC
        `,
      values,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
};

//get attachment image
export const getAttachment = async (req, res) => {
  const { ticketNum } = req.params;
  try {
    const result = await ticketPool.query(
      `
      SELECT 
        attachment,
        attachment_mimetype
      FROM tbl_tickets
      WHERE ticket_num = $1
      `,
      [ticketNum],
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Image not Found");
    }

    const image = result.rows[0].attachment;

    if (!image) {
      return res.status(404).send("No attached image");
    }

    res.set("Content-Type", result.rows[0].attachment_mimetype);
    res.send(image);
  } catch (err) {
    console.error(err);
  }
};

//start troubleshoot
export const startTroubleshoot = async (req, res) => {
  const { ticketNum } = req.params;
  const { ticketId, loggedinUserId, staffName } = req.body;
  const client = await ticketPool.connect();

  let committed = false;

  try {
    await client.query("BEGIN");

    //UPDATE tbl_tickets
    const result = await client.query(
      `
      UPDATE tbl_tickets
      SET status = 'In Progress'
      WHERE ticket_num = $1
      RETURNING user_id, ticket_id
      `,
      [ticketNum],
    );

    const userId = result.rows[0].user_id;
    const ticketId = result.rows[0].ticket_id;

    //  {#70b,6}
    /* SOCKET FOR CHANGING STATUS */
    getIO().to(`ticket:${ticketId}`).emit("ticket-status-update", {
      ticketId,
      status: "In Progress",
    });

    //INSERT DATA TO THE tbl_ticket_updates
    await client.query(
      "INSERT INTO tbl_ticket_updates(ticket_id,ticket_num,staff_name,time_started) VALUES ($1,$2,$3,NOW())",
      [ticketId, ticketNum, staffName],
    );

    /* CREATE NOTIFICATION */
    await createNotification({
      client,
      recipientId: userId,
      senderId: loggedinUserId,
      type: TIMELINE_EVENTS.TICKET_START_TROUBLESHOOT,
      title: "Start Troubleshoot",
      message: `${staffName} start Ticket # ${ticketNum}`,
      referenceId: ticketId,
      referenceType: "ticket",
    });

    //add ticket_timeline
    await createTimelineEvent({
      client,
      ticketId,
      performedBy: loggedinUserId,
      eventType: TIMELINE_EVENTS.TICKET_START_TROUBLESHOOT,
      message: `${staffName} assigned to this ticket`,
    });

    await client.query("COMMIT");

    committed = true;

    //  {#e4f,8}
    try {
      getIO().to(`user:${userId}`).emit("ticket-starttroubleshoot", {
        ticketNum,
        staffName,
      });
    } catch (socketErr) {
      console.log("Socket.IO emit failed: ", socketErr);
    }

    res.json({ success: true, message: "Ticket successfully updated." });
  } catch (err) {
    console.error(err);

    // Only rollback if the transaction wasn't committed
    if (!committed) {
      await client.query("ROLLBACK");
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    client.release();
  }
};

//TICKET MANAGEMENT - ASSIGNED
export const getAllAssignedTickets = async (req, res) => {
  const { staffName } = req.params;

  try {
    const result = await ticketPool.query(
      `
        SELECT
        t.ticket_num AS t_ticket_num,
        TO_CHAR(t.date_submitted, 'YYYY-MM-DD HH24:MI:SS') AS d_submitted,
        t.subject_title,
        t.description,
        t.r_name,
        t.asset_tag,
        t.status,
        u.ticket_num AS u_ticket_num,
        u.update_comment,
        CASE 
          WHEN u.update_attachment IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS has_updateattachment,
        TO_CHAR(u.time_started, 'YYYY-MM-DD HH24:MI:SS') AS u_time_started,
        TO_CHAR(u.time_finished, 'YYYY-MM-DD HH24:MI:SS') AS u_time_finished
        FROM tbl_tickets t
        INNER JOIN tbl_ticket_updates u
          ON t.ticket_num=u.ticket_num
        WHERE u.staff_name = $1
        ORDER BY
          CASE WHEN t.status='In Progress' THEN 0 ELSE 1 END,
          u.ticket_num DESC

      `,
      [staffName],
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
};

//UPDATE TROUBLESHOOT TICKET
export const finishTicket = async (req, res) => {
  const client = await ticketPool.connect();

  const { ticketNum } = req.params;
  const { reason, loggedinUserId, attachment } = req.body;

  const imageBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;
  const mimeType = req.file ? req.file.mimetype : null;

  let committed;

  try {
    client.query("BEGIN");

    //update tickets
    const result = await client.query(
      `
        UPDATE tbl_tickets
        SET status='Closed'
        WHERE ticket_num = $1
        RETURNING user_id,ticket_id
      `,
      [ticketNum],
    );

    const userId = result.rows[0].user_id;
    const ticketId = result.rows[0].ticket_id;

    //  {#70b,6}
    /* SOCKET FOR CHANGING STATUS */
    getIO().to(`ticket:${ticketId}`).emit("ticket-status-update", {
      ticketId,
      status: "Closed",
    });

    //update tbl_ticket_updates
    let updateTicketsQuery;
    if (!req.file) {
      updateTicketsQuery = await client.query(
        `
        UPDATE tbl_ticket_updates
        SET update_comment = $1,
          time_finished = NOW()
        WHERE ticket_num=$2 RETURNING staff_name
        `,
        [reason, ticketNum],
      );
    } else {
      updateTicketsQuery = await client.query(
        `
        UPDATE tbl_ticket_updates
        SET update_comment = $1,
          update_attachment = $2,
          update_attachment_filename = $3,
          update_attachment_mimetype = $4,
          time_finished = NOW()
        WHERE ticket_num=$5 RETURNING staff_name
        `,
        [reason, imageBuffer, fileName, mimeType, ticketNum],
      );
    }

    const staffName = updateTicketsQuery.rows[0].staff_name;

    /* CREATE NOTIFICATION */
    await createNotification({
      client,
      recipientId: userId,
      senderId: loggedinUserId,
      type: TIMELINE_EVENTS.TICKET_CLOSED,
      title: "Ticket Closed",
      message: `Ticket # ${ticketNum} is now closed`,
      referenceId: ticketId,
      referenceType: "ticket",
    });

    //add ticket_timeline
    await createTimelineEvent({
      client,
      ticketId,
      performedBy: loggedinUserId,
      eventType: TIMELINE_EVENTS.TICKET_CLOSED,
      message: `${staffName} mark this ticket as closed`,
    });

    await client.query("COMMIT");

    committed = true;

    //  {#483,11}
    try {
      getIO().to(`user:${userId}`).emit("ticket-finished", {
        ticketNum,
      });
      getIO().to("staff").emit("ticket-finished", {
        ticketNum,
      });
    } catch (socketErr) {
      console.log("Socket.IO emit failed: ", socketErr);
    }

    res.json({ success: true, message: `Ticket: ${ticketNum} is now closed` });
  } catch (err) {
    console.error(err);
    if (!committed) {
      await client.query("ROLLBACK");
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    client.release();
  }
};

//get update attachment image
export const getUpdateAttachment = async (req, res) => {
  const { ticketNum } = req.params;
  try {
    const result = await ticketPool.query(
      `
      SELECT 
        update_attachment,
        update_attachment_mimetype
      FROM tbl_ticket_updates
      WHERE ticket_num = $1
      `,
      [ticketNum],
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Image not Found");
    }

    const image = result.rows[0].update_attachment;

    if (!image) {
      return res.status(404).send("No attached image");
    }

    res.set("Content-Type", result.rows[0].update_attachment_mimetype);
    res.send(image);
  } catch (err) {
    console.error(err);
  }
};

//edit TICKET
export const saveUpdateChanges = async (req, res) => {
  const { ticketNum } = req.params;
  const { reason, isremove } = req.body;

  const isRemoveAttachment = isremove === "true";

  const imageBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;
  const mimeType = req.file ? req.file.mimetype : null;

  try {
    let query;
    if (req.file) {
      query = await ticketPool.query(
        `
        UPDATE tbl_ticket_updates
        SET update_comment = $1,
          update_attachment = $2,
          update_attachment_filename = $3,
          update_attachment_mimetype = $4
        WHERE ticket_num = $5
      `,
        [reason, imageBuffer, fileName, mimeType, ticketNum],
      );
    } else {
      if (isRemoveAttachment) {
        query = await ticketPool.query(
          `
        UPDATE tbl_ticket_updates
        SET update_comment = $1,
          update_attachment = NULL,
          update_attachment_filename = NULL,
          update_attachment_mimetype = NULL
        WHERE ticket_num = $2
      `,
          [reason, ticketNum],
        );
      } else {
        query = await ticketPool.query(
          `
        UPDATE tbl_ticket_updates
        SET update_comment = $1
        WHERE ticket_num = $2
      `,
          [reason, ticketNum],
        );
      }
    }

    if (query.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }
    res.json({
      success: true,
      message: `Ticket ${ticketNum} changes has been successfully saved`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
