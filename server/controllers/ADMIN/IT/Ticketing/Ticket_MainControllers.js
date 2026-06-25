import { ticketPool } from "../../../../db.js";

//POPULATE DEPARTMENTS
export const getDeparments = async (req, res) => {
  try {
    const result = await ticketPool.query(`
            SELECT department
            FROM tbl_department
            ORDER by department ASC
            `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//GET PROFILE DATA
export const getProfileData = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await ticketPool.query(
      `
        SELECT
        username,
        d_name,
        email,
        role,
        department
        FROM "tbl_userAccounts"
        WHERE user_id=$1
        `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "record not found",
      });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//GET PROFILE IMAGE
export const getProfileImage = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await ticketPool.query(
      `
      SELECT 
        profile_image,
        profile_image_mimetype
      FROM "tbl_userAccounts"
      WHERE user_id = $1
      `,
      [userId],
    );
    /*     console.log("userId:", userId);
    console.log("rowCount:", result.rowCount);
    console.log(result.rows.length); */
    if (result.rows.length === 0) {
      return res.status(404).send("Image not Found");
    }

    const image = result.rows[0].profile_image;

    if (!image) {
      return res.status(404).send("No profile image");
    }

    res.set("Content-Type", result.rows[0].profile_image_mimetype);
    res.send(image);
  } catch (err) {
    console.error(err);
  }
};

// SAVE CHANGES
export const applyChanges = async (req, res) => {
  const { userId } = req.params;
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: "false", message: "Server Error" });
  }
};
