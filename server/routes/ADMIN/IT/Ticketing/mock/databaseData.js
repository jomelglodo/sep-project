import express from "express";
import { ticketPool } from "../../../../../db.js";

const router = express.Router();

//get sections
router.get("/department", async (req, res) => {
  try {
    const result = await ticketPool.query(`
            SELECT department
            FROM "tbl_department"
            ORDER BY department ASC
            `);

    if (result.rows.length === 0) {
      return res.json({ message: "No record found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

//get role
router.get("/role", async (req, res) => {
  try {
    const result = await ticketPool.query(`
        SELECT unnest(enum_range(NULL::user_role)) AS role
        `);

    if (result.rows.length === 0) {
      return res.json({ message: "No role found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

//get status

router.get("/status", async (req, res) => {
  try {
    const result = await ticketPool.query(`
        SELECT unnest(enum_range(NULL::user_status)) AS status
        `);

    if (result.rows.length === 0) {
      return res.json({ message: "No status found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

export default router;
