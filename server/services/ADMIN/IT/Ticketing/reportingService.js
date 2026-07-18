import { ticketPool } from "../../../../db.js";

async function getSummary(client) {
  const result = await client.query(`
        SELECT
            COUNT(*)::integer AS total_tickets,

            COUNT(*) FILTER (
                WHERE t.status='Open'
            )::integer AS open_tickets,

            COUNT(*) FILTER (
                WHERE t.status='In Progress'
            )::integer AS in_progress_tickets,

            COUNT(*) FILTER (
                WHERE t.status='Closed'
            )::integer AS closed_tickets,

            COUNT(*) FILTER (
                WHERE t.status='Cancelled'
            )::integer AS cancelled_tickets,

            COUNT(*) FILTER (
                WHERE DATE(t.date_submitted)=CURRENT_DATE
            )::integer AS today_tickets,

            COUNT(*) FILTER (
                WHERE DATE_TRUNC('month',t.date_submitted)
                    =
                DATE_TRUNC('month',CURRENT_DATE)
            )::integer AS this_month_tickets,

           ROUND(
        AVG(
            EXTRACT(
                EPOCH FROM (
                    u.time_started - t.date_submitted
                )
            ) / 3600
        ),
        2
    ) AS average_response_hours,

    ROUND(
        AVG(
            EXTRACT(
                EPOCH FROM (
                    u.time_finished - t.date_submitted
                )
            ) / 3600
        ),
        2
    ) AS average_resolution_hours

        FROM tbl_tickets t
        LEFT JOIN tbl_ticket_updates u
        ON u.ticket_id=t.ticket_id
    `);

  return result.rows[0];
}

async function getStatusChart(client) {
  try {
    const result = await client.query(`
      SELECT status as label, COUNT(*)::integer AS value
      FROM tbl_tickets
      GROUP BY status
      ORDER BY CASE status
        WHEN 'Open' THEN 1
        WHEN 'In Progress' THEN 2
        WHEN 'Hold' THEN 3
        WHEN 'Closed' THEN 4
        WHEN 'Cancelled' THEN 5
        ELSE 99
      END
      `);
    return result.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getMonthlyTrend(client) {
  try {
    const result = await client.query(`
      WITH months AS (
        SELECT 
          generate_series(date_trunc('month',CURRENT_DATE) - interval '11 months', date_trunc('month', CURRENT_DATE), interval '1 month'
        ) AS month_start
      )

      SELECT 
        TO_CHAR(m.month_start,'Mon YYYYY') as label,
        TO_CHAR(m.month_start,'YYYY-mm') as month,
        COALESCE(COUNT(t.ticket_id),0)::integer AS value
      FROM months m
      LEFT JOIN tbl_tickets t
        ON date_trunc('month', t.date_submitted)=m.month_start
      GROUP BY m.month_start
      ORDER BY m.month_start

      `);

    return result.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getRecentTickets(client) {
  try {
    const result = await client.query(`
      SELECT
        t.ticket_id,
        t.ticket_num AS ticketNum,
        t.r_name AS user,
        ua.department,
        t.subject_title AS subject,
        t.status,
        TO_CHAR(t.date_submitted,'YYYY-MM-DD') as d_submitted
      FROM tbl_tickets t
      LEFT JOIN "tbl_userAccounts" ua
        ON t.r_name=ua.d_name
      ORDER BY t.date_submitted DESC
      LIMIT 5
      `);

    return result.rows;
  } catch (err) {
    console.error(err);
  }
}

export async function getSummaryReportData() {
  const client = await ticketPool.connect();

  try {
    const [summary, statusChart, monthlyTrend, recentTickets] =
      await Promise.all([
        getSummary(client),
        getStatusChart(client),
        getMonthlyTrend(client),
        getRecentTickets(client),
      ]);

    return {
      summary,
      statusChart,
      monthlyTrend,
      recentTickets,
    };
  } finally {
    client.release();
  }
}
