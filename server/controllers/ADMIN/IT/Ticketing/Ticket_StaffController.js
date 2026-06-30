import { response } from "express";
import { ticketPool } from "../../../../db.js";

//DASHBOARD ---------------------------------------------------------------------------

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
            ticket_num,
            TO_CHAR(date_submitted,'YYYY-MM-DD HH24:MI:SS') as d_submitted,
            r_name,
            subject_title,
            asset_tag,
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
