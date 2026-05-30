import { risPool } from "../../../../db.js";

export const receiveRis = async (req, res) => {
  try {
    const { risNum, receiveBy } = req.body;

    /* Check if RIS exist*/

    const checkRis = await risPool.query(
      "SELECT * from tbl_ris WHERE risnum = $1",
      [risNum],
    );

    if (checkRis.rows.length === 0) {
      return res.status(404).json({
        error: `RIS ${risNum} not found in the database`,
      });
    }
    await risPool.query(
      `
        UPDATE tbl_ris
        SET receivedby = $1
        WHERE risnum = $2
        `,
      [receiveBy, risNum],
    );

    res.json({
      message: `RIS Number: ${risNum} updated successfully`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
};
