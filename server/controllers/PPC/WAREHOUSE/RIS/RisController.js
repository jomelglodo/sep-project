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
  try {
    let currentDate = new Date().toISOString().split("T")[0];
    currentDate = currentDate.replace(/-/g, "/");

    const toFormatDate = new Date();
    const year = String(toFormatDate.getFullYear()).slice(-2);
    const month = String(toFormatDate.getMonth() + 1).padStart(2, "0");

    const { selectedSection, requestor, risQty, formattedDate } = req.body;

    //// GET THE LAST RIS CONTROL NUMBER
    const result_lastris = await risPool.query(`
     SELECT MAX(risnum::bigint) AS last_highest
      FROM tbl_ris;
    `);

    //let lastRisNum = Number(result_lastris.rows[0]?.last_highest) + 1 || "0001";
    let lastRisNum = result_lastris.rows[0]?.last_highest;

    if (lastRisNum === null) {
      lastRisNum = "0001";
    } else {
      lastRisNum = String(Number(String(lastRisNum).slice(-4)) + 1).padStart(
        4,
        "0",
      );
    }

    let formattedRisNum = `${year}${month}${lastRisNum}`;
    const qty = Number(risQty);
    // TEMPLATE PATH
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "ris-format.xlsx",
    );

    // LOAD EXCEL (ExcelJS)
    let totalWksUsed = 0;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const templateSheet = workbook.getWorksheet(1);
    templateSheet.name = "RIS_1";

    // TEMP QR FOLDER
    const qrDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir);
    }

    //original template sheet
    //const originalSheetName = templateSheet.name();
    templateSheet.getCell("O4").value = formattedRisNum;
    templateSheet.getCell("F4").value = selectedSection;
    templateSheet.getCell("W3").value = requestor;
    templateSheet.getCell("W5").value = formattedDate;

    //adding qr code
    let qrPath1 = path.join(qrDir, `${formattedRisNum}.png`);
    await QRCode.toFile(qrPath1, formattedRisNum);

    const img1 = workbook.addImage({
      filename: qrPath1,
      extension: "png",
    });

    templateSheet.addImage(img1, {
      tl: { col: 2.2, row: 5.9 }, // B6
      ext: { width: 50, height: 50 },
    });

    totalWksUsed++;
    //INSERT THE DATA

    await risPool.query(
      `
      INSERT INTO tbl_ris(
      risnum,
      date,
      requestor,
      section
      )
      VALUES ($1,$2,$3,$4)
      `,
      [formattedRisNum, currentDate, requestor, selectedSection],
    );

    let risNum_FileName = formattedRisNum;

    for (let i = 2; i <= qty; i++) {
      //const newSheet = workbook.cloneSheet(templateSheet, `RIS_${i}`);
      const newSheet = workbook.getWorksheet(`RIS_${i}`);

      let getTheRisNum = String(
        Number(String(formattedRisNum).slice(-4)) + 1,
      ).padStart(4, "0");

      //assign a new value to the formattedRisNum

      const newFormattedRisNum = `${year}${month}${getTheRisNum}`;

      formattedRisNum = newFormattedRisNum;

      newSheet.getCell("O4").value = newFormattedRisNum;
      newSheet.getCell("F4").value = selectedSection;
      newSheet.getCell("W3").value = requestor;
      newSheet.getCell("W5").value = formattedDate;

      //adding qr code
      qrPath1 = path.join(qrDir, `${newFormattedRisNum}.png`);
      await QRCode.toFile(qrPath1, newFormattedRisNum);

      const img1 = workbook.addImage({
        filename: qrPath1,
        extension: "png",
      });

      newSheet.addImage(img1, {
        tl: { col: 2.2, row: 5.9 }, // B6
        ext: { width: 50, height: 50 },
      });

      await risPool.query(
        `
      INSERT INTO tbl_ris(
      risnum,
      date,
      requestor,
      section
      )
      VALUES ($1,$2,$3,$4)
      `,
        [newFormattedRisNum, currentDate, requestor, selectedSection],
      );
      totalWksUsed++;
      if (i === qty) {
        risNum_FileName = `${risNum_FileName}-${newFormattedRisNum}`;
      }
    }

    //HIDE UNUNSED WORKSHEET
    if (totalWksUsed < 5) {
      for (let wksCounter = totalWksUsed + 1; wksCounter <= 5; wksCounter++) {
        const sheetToHide = workbook.getWorksheet(`RIS_${wksCounter}`);
        if (sheetToHide) {
          sheetToHide.state = "veryHidden";
        }
      }
    }

    //ORIGNAL WORKSHEET COPY
    const orignalWks = workbook.getWorksheet(`ORIGINAL`);
    if (orignalWks) {
      orignalWks.state = "veryHidden";
    }

    //output buffer
    const buffer = await workbook.xlsx.writeBuffer();

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
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
