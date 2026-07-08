import { ticketPool } from "../../../../db.js";

//get user count
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
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//populate users
export const userList = async (req, res) => {
  try {
    const result = await ticketPool.query(`
      SELECT 
        user_id,
        d_name,
        username,
        email,
        department,
        role,
        status,
        last_login
      FROM "tbl_userAccounts"
      WHERE status IN('Active','Inactive')
      ORDER BY user_id ASC
      `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//add new user
export const addUser = async (req, res) => {
  const {
    d_name,
    username,
    password,
    department,
    email: userEmail,
    role,
    status,
    created_by,
  } = req.body;
  const email = userEmail?.trim() || null;
  try {
    const result = await ticketPool.query(
      `
      INSERT INTO "tbl_userAccounts" (
        username,
        password,
        d_name,
        department,
        email,
        role,
        status,
        date_created,
        created_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,NOW(),$8)
       RETURNING *
      `,
      [username, password, d_name, department, email, role, status, created_by],
    );

    if (result.rowCount === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Error in adding new user" });
    }
    return res.status(201).json({
      success: true,
      user: result.rows[0],
      message: "User successfully created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//update selecteduser
export const updateUser = async (req, res) => {
  const {
    user_id,
    d_name,
    username,
    email: userEmail,
    department,
    role,
    status,
  } = req.body;
  const email = userEmail?.trim() || null;
  try {
    const result = await ticketPool.query(
      `
      UPDATE "tbl_userAccounts"
      SET
        d_name=$1,
        username=$2,
        email=$3,
        department=$4,
        role=$5,
        status=$6
      WHERE user_id=$7
      RETURNING *
      `,
      [d_name, username, email, department, role, status, user_id],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Unknown record" });
    }

    res.json({
      success: true,
      user: result.rows[0],
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//delete selecteduser
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await ticketPool.query(
      `UPDATE "tbl_userAccounts" SET status='Deleted' WHERE user_id=$1 RETURNING user_id`,
      [userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.json({
      success: true,
      userid: result.rows[0],
      message: "Ticket successfully deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
