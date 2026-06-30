import { ticketPool } from "../../../../db.js";

//CHANGE PASSWORD------------------------------------------------------------

//PASSWORD VALIDATION
export const passValidation = async (req, res) => {
  const { userId, curPass } = req.body;

  try {
    const result = await ticketPool.query(
      `
      SELECT 1
      FROM "tbl_userAccounts"
      WHERE user_id=$1
        AND password=$2
      `,
      [userId, curPass],
    );

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "Incorrect Password" });
    }

    return res.json({ success: true, message: "Correct password" });
  } catch (err) {
    console.error(err);
  }
};

//UPDATE PASSWORD

export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { newPass } = req.body;

  try {
    const result = await ticketPool.query(
      `
      UPDATE "tbl_userAccounts"
      SET password = $1
      WHERE user_id = $2
      `,
      [newPass, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Account does not exists" });
    }

    return res.json({
      success: true,
      message: "Password successfully changed",
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Server Error" });
  }
};

//UPDATE PROFILE DATA

//POPULATE DEPARTMENTS--------------------------------------------------------
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
  const { displayname, email, department } = req.body;

  let imageBuffer;
  let filename;
  let mimeType;

  if (req.file) {
    imageBuffer = req.file.buffer;
    filename = req.file.originalname;
    mimeType = req.file.mimetype;
  }

  /*   console.log(req.body);
  console.log(req.headers["content-type"]); */
  try {
    const result = await ticketPool.query(
      `
      UPDATE "tbl_userAccounts"
      SET
        d_name = $1,
        email = $2,
        department = $3,
        profile_image = COALESCE($4,profile_image),
        profile_image_filename = COALESCE($5,profile_image_filename),
        profile_image_mimetype = COALESCE($6, profile_image_mimetype)
      WHERE user_id = $7
      `,
      [
        displayname,
        email,
        department,
        imageBuffer ?? null,
        filename ?? null,
        mimeType ?? null,
        userId,
      ],
    );

    if (result.rowCount == 0) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }

    return res.json({ success: true, message: "Record successfully updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: "false", message: "Server Error" });
  }
};
