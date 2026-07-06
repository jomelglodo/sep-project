import { ticketPool } from "../../../../db.js";

export const userCounter = async (req, res) => {
  try {
    const result = await ticketPool.query(`
        SELECT 
        COUNT(*) as TOTAL,
        COUNT(*) FILTER (WHERE status='Active') as active_count,
        COUNT(*) FILTER (WHERE status='Inactive') as inactive_count,
        COUNT(*) FILTER (WHERE role='admin') as admin_counter
        FROM "tbl_userAccounts"
        `);
    if (result.rows.length === 0) {
      return res.json({ message: "No records found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
  }
};
