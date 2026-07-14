import express from "express";
import { ticketPool } from "../../../../../db.js";

const router = express.Router();

//ASSETS

//read
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

//create
router.post("/assets", async (req, res) => {
  try {
    const { asset_name } = req.body;

    const result = await ticketPool.query(
      `
      INSERT INTO tbl_asset(
      asset,
      date_created,
      created_by
      ) VALUES($1,NOW(),'Administrator') RETURNING *
      `,
      [asset_name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//update
router.put("/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { asset_name } = req.body;

    const result = await ticketPool.query(
      `
      UPDATE tbl_asset
      SET asset = $1
      WHERE id = $2
      RETURNING *
      `,
      [asset_name, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//delete
router.delete("/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ticketPool.query(`DELETE FROM tbl_asset WHERE id=$1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//DEPARTMENTS
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

//create
router.post("/departments", async (req, res) => {
  try {
    const { department_name } = req.body;

    const result = await ticketPool.query(
      `
      INSERT INTO tbl_department(
      department,
      date_created,
      created_by
      ) VALUES($1,NOW(),'Administrator') RETURNING *
      `,
      [department_name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//update
router.put("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name } = req.body;

    const result = await ticketPool.query(
      `
      UPDATE tbl_department
      SET department = $1
      WHERE d_id = $2
      RETURNING *
      `,
      [department_name, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//delete
router.delete("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ticketPool.query(`DELETE FROM tbl_department WHERE d_id=$1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
