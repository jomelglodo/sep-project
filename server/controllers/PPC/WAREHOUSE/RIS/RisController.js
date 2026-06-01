import { risPool } from "../../../../db.js";
import XlsxPopulate from "xlsx-populate";
import ExcelJS from "exceljs";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";

/* RIS GET SECTIONS */
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

// CHECK RIS CUTOFF STATUS
export const getCutOffStatus = async (req, res) => {
  try {
    const result = await risPool.query(`SELECT status FROM "tbl_risStatus"`);
    res.json(result.rows[0]?.status);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// GENERATE EXCEL RIS

export const generateRIS = async (req, res) => {
  const client = await risPool.connect();

  try {
    await client.query("BEGIN");

    let currentDate = new Date().toISOString().split("T")[0];
    currentDate = currentDate.replace(/-/g, "/");

    const toFormatDate = new Date();
    const year = String(toFormatDate.getFullYear()).slice(-2);
    const month = String(toFormatDate.getMonth() + 1).padStart(2, "0");

    const { selectedSection, requestor, risQty, formattedDate } = req.body;

    const qty = Number(risQty);

    //FUNCTION TO FORMAT RIS NUMBER
    const buildRisNum = (num) =>
      `${year}${month}${String(num).padStart(4, "0")}`;

    // =========================
    // FIRST NUMBER (ATOMIC)
    // =========================

    const result = await client.query(`
      UPDATE ris_control
      SET last_number = last_number + 1
      WHERE id=1
      RETURNING last_number
      `);

    let currentNum = result.rows[0].last_number;
    let firstRis = buildRisNum(currentNum);

    /* EXCEL SET UP */

    // TEMPLATE PATH
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "ris-format.xlsx",
    );

    // LOAD EXCEL (ExcelJS)

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const templateSheet = workbook.getWorksheet(1);
    templateSheet.name = "RIS_1";

    // TEMP QR FOLDER
    const qrDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir);
    }

    let totalWksUsed = 1;

    // =========================
    // ONE RIS
    // =========================

    //original template sheet
    //const originalSheetName = templateSheet.name();
    templateSheet.getCell("O4").value = firstRis;
    templateSheet.getCell("F4").value = selectedSection;
    templateSheet.getCell("W3").value = requestor;
    templateSheet.getCell("W5").value = formattedDate;

    //adding qr code
    let qrPath = path.join(qrDir, `${firstRis}.png`);
    await QRCode.toFile(qrPath, firstRis);

    const img = workbook.addImage({
      filename: qrPath,
      extension: "png",
    });

    templateSheet.addImage(img, {
      tl: { col: 2.2, row: 5.9 }, // B6
      ext: { width: 50, height: 50 },
    });
    //INSERT THE DATA

    await client.query(
      `
      INSERT INTO tbl_ris(
      risnum,
      date,
      requestor,
      section
      )
      VALUES ($1,$2,$3,$4)
      `,
      [firstRis, currentDate, requestor, selectedSection],
    );

    let risNum_FileName = firstRis;

    // =========================
    // MULTIPLE RIS
    // =========================

    for (let i = 2; i <= qty; i++) {
      const seq = await client.query(`
      UPDATE ris_control
      SET last_number = last_number + 1
      WHERE id=1
      RETURNING last_number
      `);

      const num = seq.rows[0].last_number;

      const newRis = buildRisNum(num);
      //const newSheet = workbook.cloneSheet(templateSheet, `RIS_${i}`);
      const newSheet = workbook.getWorksheet(`RIS_${i}`);

      newSheet.getCell("O4").value = newRis;
      newSheet.getCell("F4").value = selectedSection;
      newSheet.getCell("W3").value = requestor;
      newSheet.getCell("W5").value = formattedDate;

      //adding qr code
      qrPath = path.join(qrDir, `${newRis}.png`);
      await QRCode.toFile(qrPath, newRis);

      const img2 = workbook.addImage({
        filename: qrPath,
        extension: "png",
      });

      newSheet.addImage(img2, {
        tl: { col: 2.2, row: 5.9 }, // B6
        ext: { width: 50, height: 50 },
      });

      await client.query(
        `
      INSERT INTO tbl_ris(
      risnum,
      date,
      requestor,
      section
      )
      VALUES ($1,$2,$3,$4)
      `,
        [newRis, currentDate, requestor, selectedSection],
      );

      totalWksUsed++;

      if (i === qty) {
        risNum_FileName = `${risNum_FileName}-${newRis}`;
      }
    }

    //HIDE UNUNSED WORKSHEET
    if (totalWksUsed < 5) {
      for (let wksCounter = totalWksUsed + 1; wksCounter <= 5; wksCounter++) {
        const sheetToHide = workbook.getWorksheet(`RIS_${wksCounter}`);
        if (sheetToHide) sheetToHide.state = "veryHidden";
      }
    }

    //ORIGNAL WORKSHEET COPY
    const orignalWks = workbook.getWorksheet(`ORIGINAL`);
    if (orignalWks) orignalWks.state = "veryHidden";

    //output buffer
    const buffer = await workbook.xlsx.writeBuffer();

    await client.query("COMMIT");

    //send excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename=RIS_Form.xlsx`);

    res.setHeader("new-risnum", risNum_FileName);

    //expose the custom header new-risnum
    res.setHeader("Access-Control-Expose-Headers", "new-risnum");
    res.send(buffer);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  } finally {
    client.release;
  }
};
