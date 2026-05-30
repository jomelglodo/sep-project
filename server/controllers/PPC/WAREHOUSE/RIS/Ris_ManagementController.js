import { risPool } from "../../../../db.js";
import ExcelJS from "exceljs";

// GET SECTIONS

export const getSections = async (req, res) => {
  try {
    const result = await risPool.query(
      "SELECT section FROM tbl_section ORDER BY section ASC",
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET WAREHOUSE STAFF

export const getStaff = async (req, res) => {
  try {
    const result = await risPool.query(
      "SELECT staff FROM tbl_warehousestaff ORDER BY staff ASC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// POPULATE RIS DATA TABLE

export const getRisData = async (req, res) => {
  try {
    const result = await risPool.query(`
      SELECT 
      risnum,
      date,
      requestor,
      section,
      receivedby
      FROM tbl_ris
      ORDER BY risnum DESC
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

//SET CUT OFF IN RIS-----------------------------------------------------------------
//GET THE CUT OFF STATUS
export const getCutOffStatus = async (req, res) => {
  try {
    const getstatus = await risPool.query(`
      SELECT status
      FROM "tbl_risStatus"
      `);
    res.json(getstatus.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

//GET CUT OFF PASSWORD
export const getCutOffPassword = async (req, res) => {
  try {
    //use for set cutoff ris
    const { cutOffPassword, saveDataPassword, voidPassword } = req.body;
    const result = await risPool.query(
      `
      SELECT password FROM tbl_accounts
      WHERE role=$1
      `,
      ["admin"],
    );

    const dbPassword = result.rows[0].password;

    const password = cutOffPassword || voidPassword || saveDataPassword;
    if (password === dbPassword) {
      return res.json({ success: true });
    }

    return res.status(404).json({
      success: false,
      message: "Wrong Password",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

/* SET CUT OFF UPDATE tbl_status */

export const updateRisStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let newStatus = "";

    if (status === "FALSE") {
      newStatus = "TRUE";
    } else {
      newStatus = "FALSE";
    }

    const updateStatus = await risPool.query(
      `
      UPDATE "tbl_risStatus"
      SET status = $1
      `,
      [newStatus],
    );
    res.json({
      succes: true,
      newStatus: newStatus,
      message: "Cutoff Status updated!",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error", success: false });
  }
};

//---------------------------------------------------------------------------------------

//VOID RIS-------------------------------------------------------------------------------

export const voidRis = async (req, res) => {
  try {
    const result = await risPool.query(
      `
      UPDATE tbl_ris
      SET receivedby='VOID'
      WHERE receivedby IS NULL
      OR receivedby = ''     
      `,
    );
    res.status(200).json({
      success: true,
      message: "Successfully voided all unreceived RIS",
      updatedRows: result.rowCount,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error", succes: false });
  }
};

//ONGOING RIS----------------------------------------------------------------------------

export const showOngoingRis = async (req, res) => {
  try {
    const result = await risPool.query(`
      SELECT 
      risnum,
      date,
      requestor,
      section
      FROM tbl_ris
      WHERE
      receivedby = '' OR receivedby IS NULL
      ORDER BY risnum DESC
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error", success: false });
  }
};

export const voidSelectedRis = async (req, res) => {
  try {
    const { selectedRisNum } = req.body;
    const result = await risPool.query(
      `
      UPDATE tbl_ris
      SET receivedby='VOID'
      WHERE risnum=$1
      `,
      [selectedRisNum],
    );

    res.status(200).json({
      success: true,
      message: `RIS Number: ${selectedRisNum} has been successfully voided!`,
      updatedRows: result.rowCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
//---------------------------------------------------------------------------------------

//SAVE DATA----------------------------------------------------------------------------

//check if all ris were received
export const saveCheckAllRis = async (req, res) => {
  try {
    const result = await risPool.query(`
      SELECT receivedby
      FROM tbl_ris
      WHERE receivedby='' 
      OR receivedby IS NULL
      `);
    const dataCount = Number(result.rowCount);
    res.json({ dataAffected: dataCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//FETCH ALL RIS DATA
async function fetchAllRISData() {
  try {
    const data = await risPool.query(
      "SELECT * FROM tbl_ris ORDER BY CAST(risnum AS INTEGER) DESC",
    );

    return data.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function backupClearRisData() {
  const client = await risPool.connect();

  try {
    await client.query("BEGIN");
    //delete all backup data
    await client.query("DELETE FROM tbl_backup_ris");

    // copy the ris data to backup table
    await client.query(`
      INSERT INTO tbl_backup_ris(risnum,date,requestor,section, receivedby)
      SELECT risnum,date,requestor,section,receivedby FROM tbl_ris
      `);

    //clear the data in the tbl_ris

    await client.query("DELETE FROM tbl_ris");

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

//CREATE A WORKBOOK
export const saveCreatedWorkbook = async (req, res) => {
  try {
    const { savedby } = req.body;
    const year = String(new Date().getFullYear());
    const month = new Date().toLocaleString("default", {
      month: "long",
    });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data");

    const risData = await fetchAllRISData();
    if (!risData || risData.length === 0) {
      return res.status(500).json({ message: "No Data found in the Database" });
    }

    let counter = 2;

    sheet.mergeCells("A1:E1");
    const rowA1 = sheet.getCell("A1");
    const rowF2 = sheet.getCell("F2");

    sheet.getCell("A2").value = "REQUISITION NUMBER";
    sheet.getCell("B2").value = "DATE";
    sheet.getCell("C2").value = "REQUESTOR";
    sheet.getCell("D2").value = "SECTION";
    sheet.getCell("E2").value = "RECEIVED BY";

    ["A2", "B2", "C2", "D2", "E2"].forEach((addr) => {
      sheet.getCell(addr).font = {
        size: 13,
        bold: true,
        name: "Courier New",
        color: { argb: "FF0000FF" },
      };

      sheet.getCell(addr).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    });

    //manually adjust the width of column A -> E
    sheet.getColumn("A").width = 29;
    sheet.getColumn("B").width = 33.91;
    sheet.getColumn("C").width = 29.27;
    sheet.getColumn("D").width = 24.91;
    sheet.getColumn("E").width = 19;

    //ROW A1
    sheet.getRow(1).height = 59.4;

    rowA1.value = `RECORD FOR THE MONTH OF ${month} ${year}`;

    rowA1.font = {
      size: 32,
      bold: true,
      name: "Courier New",
      color: { argb: "FF3D72FF" },
    };

    rowA1.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    //ROW F2

    rowF2.value = `Saved By: ${savedby}`;
    sheet.getColumn("F").width = 49.56;

    rowF2.font = {
      size: 13,
      name: "Courier New",
      bold: true,
    };

    rowF2.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    //this will populate the next blank rows
    risData.forEach((item) => {
      counter++;

      const row = sheet.addRow([
        item.risnum,
        item.date,
        item.requestor,
        item.section,
        item.receivedby,
      ]);

      row.eachCell((cell) => {
        cell.font = {
          name: "Courier New",
          size: 12,
          bold: false,
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });
      //check the row index where it start
      //console.log(row.number);
    });

    //display the total data

    sheet.getCell("F1").value = `Total Data : ${counter - 2}`;

    sheet.getCell("F1").font = {
      size: 13,
      name: "Courier New",
      bold: true,
    };

    sheet.getCell("F1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    /*     risData.forEach((item) => {
      counter++;
      sheet.getCell("A" + counter).value = item.risnum;
      sheet.getCell("B" + counter).value = item.date;
      sheet.getCell("C" + counter).value = item.requestor;
      sheet.getCell("D" + counter).value = item.section;
      sheet.getCell("E" + counter).value = item.receivedby;

      //USING TEMPLATE LITERALS
      // sheet.getCell(`A${counter}`).value = item.risnum;
      // sheet.getCell(`B${counter}`).value = item.date;
      // sheet.getCell(`C${counter}`).value = item.requestor;
      // sheet.getCell(`D${counter}`).value = item.section;
      // sheet.getCell(`E${counter}`).value = item.receivedby;
    }); */
    //FETCH ALL DATA IN RIS

    // sample data

    // set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=ris.xlsx");

    //backup data to the tbl_backup_ris
    await backupClearRisData();

    // send file stream
    await workbook.xlsx.write(res);

    //res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel file");
  }
};

//---------------------------------------------------------------------------------------
