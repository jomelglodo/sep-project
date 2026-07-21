import XLSX from "xlsx";
import { ticketPool } from "../../../../db.js";
import { getSummaryReportData } from "../../../../services/ADMIN/IT/Ticketing/reportingService.js";

export async function getSummaryReport(req, res) {
  try {
    const data = await getSummaryReportData();

    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load summary report",
    });
  }
}

//TICKET HISTORY
export async function getTicketHistory(req, res) {
  try {
    const condition = [];
    const values = [];
    const {
      status,
      department,
      staff,
      month,
      search,
      page = 1,
      limit = 20,
      sortBy = "date_submitted",
      sortOrder = "DESC",
    } = req.query;

    let query = `
    SELECT
      t.ticket_id,
      t.ticket_num,
      t.r_name,
      ua.department,
      t.asset,
      t.subject_title,
      t.status,
      t.date_submitted,
      u.staff_name,
      COUNT(*) OVER() AS total_rows
    FROM tbl_tickets t
    LEFT JOIN tbl_ticket_updates u
     ON t.ticket_id=u.ticket_id
    LEFT JOIN "tbl_userAccounts" ua
      ON t.user_id=ua.user_id
    `;

    if (status) {
      values.push(status);

      condition.push(`t.status = $${values.length}`);
    }

    if (department) {
      values.push(department);
      condition.push(`ua.department = $${values.length}`);
    }

    if (staff) {
      values.push(staff);
      condition.push(`u.staff_name = $${values.length}`);
    }

    if (month) {
      values.push(month);
      condition.push(`To_CHAR(t.date_submitted,'YYYY-MM') = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);

      condition.push(`
      (
        t.ticket_num ILIKE $${values.length}
        OR t.r_name ILIKE $${values.length}
        OR t.subject_title ILIKE $${values.length}
        OR t.asset ILIKE $${values.length}  
      )
        `);
    }

    if (condition.length) {
      query += `WHERE ${condition.join(" AND ")}`;
    }

    /* SORTING */

    const allowedSortColumns = {
      date_submitted: "t.date_submitted",
      ticket_num: "t.ticket_num",
      status: "t.status",
      employee: "t.r_name",
    };

    const sortColumn = allowedSortColumns[sortBy] ?? "t.date_submitted";

    const direction = sortOrder === "ASC" ? "ASC" : "DESC";

    query += `
    ORDER BY ${sortColumn} ${direction}
    `;

    /* PAGINATION */

    const offset = (Number(page) - 1) * Number(limit);

    values.push(limit);

    query += `
    LIMIT $${values.length}
    `;

    values.push(offset);

    query += `
    OFFSET $${values.length}
    `;

    const result = await ticketPool.query(query, values);

    /* RETURN VALUE */
    const total = result.rows.length ? Number(result.rows[0].total_rows) : 0;
    /*  console.log("Query:" + query + "==length:" + total); */
    res.json({
      success: true,
      tickets: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalpages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function getReportingLookups(req, res) {
  try {
    const [department, staff] = await Promise.all([
      ticketPool.query(`
        SELECT department
        FROM tbl_department
        ORDER BY department
        `),
      ticketPool.query(`
          SELECT 
            user_id,
            d_name AS staff_name
          FROM "tbl_userAccounts"
          WHERE role='staff'
          ORDER BY d_name 
          `),
    ]);

    res.json({
      success: true,
      departments: department.rows,
      staff: staff.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function exportTicketHistory(req, res) {
  try {
    const condition = [];
    const values = [];

    const {
      status,
      department,
      staff,
      month,
      search,
      sortBy = "date_submitted",
      sortOrder = "DESC",
    } = req.query;

    let query = `
      SELECT
        t.ticket_num AS "Ticket No.",
        t.r_name AS "Employee",
        ua.department AS "Department",
        t.asset AS "Asset",
        t.subject_title AS "Subject",
        t.status AS "Status",
        u.staff_name AS "Assigned Staff",
        t.date_submitted AS "Date Submitted"
      FROM tbl_tickets t
      LEFT JOIN tbl_ticket_updates u
        ON t.ticket_id = u.ticket_id
      LEFT JOIN "tbl_userAccounts" ua
        ON t.user_id = ua.user_id
    `;

    // -------------------------
    // FILTERS
    // -------------------------

    if (status) {
      values.push(status);
      condition.push(`t.status = $${values.length}`);
    }

    if (department) {
      values.push(department);
      condition.push(`ua.department = $${values.length}`);
    }

    if (staff) {
      values.push(staff);
      condition.push(`u.staff_name = $${values.length}`);
    }

    if (month) {
      values.push(month);
      condition.push(
        `TO_CHAR(t.date_submitted, 'YYYY-MM') = $${values.length}`,
      );
    }

    if (search) {
      values.push(`%${search}%`);

      condition.push(`
        (
          t.ticket_num ILIKE $${values.length}
          OR t.r_name ILIKE $${values.length}
          OR t.subject_title ILIKE $${values.length}
          OR t.asset ILIKE $${values.length}
        )
      `);
    }

    if (condition.length) {
      query += ` WHERE ${condition.join(" AND ")}`;
    }

    // -------------------------
    // SORTING
    // -------------------------

    const allowedSortColumns = {
      date_submitted: "t.date_submitted",
      ticket_num: "t.ticket_num",
      status: "t.status",
      employee: "t.r_name",
    };

    const sortColumn = allowedSortColumns[sortBy] ?? "t.date_submitted";

    const direction = sortOrder === "ASC" ? "ASC" : "DESC";

    query += `
      ORDER BY ${sortColumn} ${direction}
    `;

    const result = await ticketPool.query(query, values);

    const reportDate = new Date().toLocaleString();

    const totalRecords = result.rows.length;

    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Maintenance Ticket History Report"],
      [],
      ["Generated:", reportDate],
      ["Total Records:", totalRecords],
      [],
    ]);

    XLSX.utils.sheet_add_json(worksheet, result.rows, { origin: "A6" });

    const columns = Object.keys(result.rows[0] ?? {}).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...result.rows.map((row) => String(row[key] ?? "").length),
      );
      return {
        wch: maxLength + 3,
      };
    });

    worksheet["!cols"] = [
      { wch: 15 }, // Ticket No.
      { wch: 25 }, // Employee
      { wch: 20 }, // Department
      { wch: 20 }, // Asset
      { wch: 35 }, // Subject
      { wch: 15 }, // Status
      { wch: 20 }, // Assigned Staff
      { wch: 20 }, // Date Submitted
    ];

    //freeze the column header
    worksheet["!freeze"] = {
      xSplit: 0,
      ySplit: 5,
    };

    //merging the title
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 }, // A1
        e: { r: 0, c: 7 }, // H1
      },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "History Report");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const today = new Date();

    const filename = `Ticket_History_${today.toISOString().split("T")[0]}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    res.send(buffer);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to export ticket history.",
    });
  }
}
