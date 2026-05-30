import { risPool } from "../../../../db.js";

/* RIS LOGIN VERIFICATION */
export const risLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await risPool.query(
      `SELECT username,password
      FROM tbl_accounts 
      WHERE username=$1
      AND password=$2
      `,
      [username, password],
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        user: result.rows[0],
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
