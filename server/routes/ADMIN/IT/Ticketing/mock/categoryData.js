import express from "express";
import { ticketPool } from "../../../../../db.js";

const router = express.Router();

router.get("/assets", async (req, res) => {
  try {
    const result = await ticketPool.query(`
        SELECT
          id,
          asset,
          created_by
        FROM tbl_asset
        ORDER by id ASC
        `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

router.get("/departments", async (req, res) => {
  try {
    const result = await ticketPool.query(`
        SELECT
          d_id,
          department,
          created_by
        FROM tbl_department
        ORDER by d_id ASC
        `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

export default router;
