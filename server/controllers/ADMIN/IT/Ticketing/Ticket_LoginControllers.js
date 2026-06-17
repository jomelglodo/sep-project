import { ticketPool } from "../../../../db.js";

//ACCOUNT VALIDATION
export const accountValidation = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await ticketPool.query(
      `
            SELECT username,password,d_name,role
            FROM "tbl_userAccounts"
            WHERE username = $1
            AND password = $2
            `,
      [username, password],
    );

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        d_name: result.rows[0].d_name,
        role: result.rows[0].role,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
async function ifAccountExist(username, password) {
  try {
    const result = await ticketPool.query(
      `
        SELECT 1
        FROM "tbl_userAccounts"
        WHERE username =$1
        AND password =$2
        `,
      [username, password],
    );

    return result.rowCount > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}
//UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  const { changeUsername, changeCurrentPassword, changeNewPassword } = req.body;
  const isExist = await ifAccountExist(changeUsername, changeCurrentPassword);

  try {
    if (!isExist) {
      return res.json({ message: "Account not exists!" });
    }

    //UPDATE PASSWORD
    const result = await ticketPool.query(
      `
    UPDATE "tbl_userAccounts"
    SET password = $1
    WHERE username = $2
    `,
      [changeNewPassword, changeUsername],
    );

    if (result.rowCount > 0) {
      return res.json({ success: true, message: "Update Successfully" });
    } else {
      return res.json({ success: false, message: "Update Error" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
