import { conPool } from "../../../../db.js";
import ExcelJS from "exceljs";

//LOGIN password verification
export const checkPassword = async (req, res) => {
  const { enterPassword } = req.body;
  try {
    const result = await conPool.query(
      `
            SELECT password
            FROM "tbl_adminAccount"
            WHERE id = 1
            AND password = $1
            `,
      [enterPassword],
    );

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        message: "Successfully Log-in",
      });
    }
    // IMPORTANT: always respond
    return res.json({
      success: false,
      message: "Incorrect Password",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Incorrect Password" });
  }
};

//GET SECTION
export const getSection = async (req, res) => {
  try {
    const result = await conPool.query(`
      SELECT section
      FROM "tbl_sectionList"
      ORDER BY section ASC
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

//GET STAFF
export const getStaff = async (req, res) => {
  try {
    const result = await conPool.query(`
        SELECT name
        FROM "tbl_staffName"
        ORDER BY name ASC
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

//GET MATERIAL MASTERLIST
export const getMasterList = async (req, res) => {
  try {
    const result = await conPool.query(`
      SELECT * 
      FROM tbl_masterlist     
      ORDER BY i_code ASC 
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

//SEARCH DATA
export const getAllData = async (req, res) => {
  try {
    const search = req.query.search || "";
    const dateFrom = req.query.dateFrom || "";
    const dateTo = req.query.dateTo || "";

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    // month filter previous month and current month
    /*   conditions.push(`
       d_received >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
      AND d_received < date_trunc('month',CURRENT_DATE + interval '1month')
      `); */

    if (search.trim() !== "") {
      conditions.push(`
        (
          i_code ILIKE $${paramIndex}
          OR section ILIKE $${paramIndex}
          OR m_name ILIKE $${paramIndex}
        )
      `);

      params.push(`%${search}%`);
      paramIndex++;
    }

    //DATE RANGE
    if (dateFrom && dateTo) {
      conditions.push(`
          d_received BETWEEN $${paramIndex} AND $${paramIndex + 1}
        `);

      params.push(dateFrom, dateTo);
      paramIndex += 2;
    } else {
      conditions.push(`
        d_received >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        AND d_received < date_trunc('month', CURRENT_DATE + INTERVAL '1 month')
      `);
    }

    const query = `
      SELECT
      id,
      i_code,
      section,
      m_name,
      unit,
      i_qty,
      i_by,
      cat,
      ris_num,
      TO_CHAR(d_received, 'YYYY-MM-DD') AS d_received
      FROM "tbl_issuanceRecord"
      WHERE ${conditions.join(" AND ")}
      ORDER BY id DESC
    `;

    const result = await conPool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
/* export const getAllData = async (req, res) => {
  try {
    const search = req.query.search || "";

    let query;
    let params;

    //SEARCH ONLY PREVIOUS DATE AND CURRENT DATE
    const baseDateFilter = `
    d_received >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    AND d_received < date_trunc('month',CURRENT_DATE + interval '1month')
    `;

    //IF SEARCH EXISTS => return all matches
    if (search.trim() !== "") {
      query = `
      SELECT   id,
        i_code,
        section,
        m_name,
        unit,
        i_qty,
        i_by,
        cat,
        ris_num,
        TO_CHAR(d_received, 'YYYY-MM-DD') AS d_received 
        FROM "tbl_issuanceRecord"
        WHERE
        (${baseDateFilter})
        AND(
        i_code ILIKE $1 OR
        section ILIKE $1 OR
        m_name ILIKE $1)
        ORDER BY id DESC
      `;
      params = [`%${search}%`];
    } else {
      // IF NO SEARCH FOUND => RETURN A RECORD LIMIT 1000
      query = `
        SELECT 
        id,
        i_code,
        section,
        m_name,
        unit,
        i_qty,
        i_by,
        cat,
        ris_num,
        TO_CHAR(d_received, 'YYYY-MM-DD') AS d_received
        FROM "tbl_issuanceRecord"
        WHERE (${baseDateFilter})
        ORDER BY id DESC
      `;
      params = [];
    }
    const result = await conPool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}; */

//INSERT DATA----------------------------------------------------------------------------

export const insertData = async (req, res) => {
  try {
    const {
      iCode,
      rDate,
      risNum,
      mName,
      suppName,
      unit,
      sSection,
      iBy,
      iQty,
      category,
    } = req.body;
    console.log(rDate);
    const result = await conPool.query(
      `
      INSERT INTO "tbl_issuanceRecord"
      (d_received,section,i_code,m_name,unit,i_by,i_qty,supp,cat,ris_num)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING i_code;
      `,
      [
        rDate,
        sSection,
        iCode,
        mName,
        unit,
        iBy,
        iQty,
        suppName,
        category,
        risNum,
      ],
    );
    res
      .status(200)
      .json({ success: true, message: `${iCode} successfully submitted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

//----------------------------------------------------------------------------

//DELETE SELECTED ID----------------------------------------------------------
export const deleteSelected = async (req, res) => {
  try {
    const { id } = req.params;
    //const selectedId = req.params.id
    const result = await conPool.query(
      `
      DELETE FROM "tbl_issuanceRecord"
      WHERE id= $1
    `,
      [id],
    );

    //check if theres an affected row
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.json({
      success: true,
      message: `Selected ID : ${id} successfully deleted`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

//----------------------------------------------------------------------------

//UPDATE SELECTED ID----------------------------------------------------------

export const updateSelected = async (req, res) => {
  const { editId } = req.params;
  const { risNum, section, convertedQty } = req.body;
  try {
    const result = await conPool.query(
      `
      UPDATE "tbl_issuanceRecord"
      SET 
        ris_num = $1,
        section = $2,
        i_qty = $3
      WHERE id = $4
      `,
      [risNum, section, convertedQty, editId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.json({
      success: true,
      message: `ID Number: ${editId} successfully updated!`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//----------------------------------------------------------------------------
//REUSABLE AUTOFIT CONTENT OF WORKSHEET
function autoFitColumn(worksheet) {
  worksheet.columns.forEach((column) => {
    let maxLength = 0;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value?.toString() || "";
      maxLength = Math.max(maxLength, value.length);
    });

    column.width = Math.max(maxLength + 2, 10);
  });
}
//EXPORT DATA-----------------------------------------------------------------
export const exportData = async (req, res) => {
  try {
    const { tableData } = req.body;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("DATA");

    if (!tableData || tableData.length === 0) {
      return res.status(500).json({ message: "No data found" });
    }

    sheet.mergeCells("A1:C2");

    //TITLE
    const titleCell = sheet.getCell("A1");
    titleCell.value = "Generated Data";

    titleCell.font = {
      size: 18,
      name: "Calibri",
      bold: true,
    };

    titleCell.alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    sheet.getCell("A3").value = "DATE";
    sheet.getCell("B3").value = "SECTION";
    sheet.getCell("C3").value = "ITEM CODE";
    sheet.getCell("D3").value = "MATERIAL NAME";
    sheet.getCell("E3").value = "UNIT";
    sheet.getCell("F3").value = "CATEGORY";
    sheet.getCell("G3").value = "ISSUED QTY.";
    sheet.getCell("H3").value = "ISSUED BY";

    const rangeToFormat = ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3"];

    rangeToFormat.forEach((cRange) => {
      sheet.getCell(cRange).font = {
        size: 12,
        bold: true,
        name: "Calibri",
        color: { argb: "FF000000" }, // black font (ARGB format)
      };
      sheet.getCell(cRange).alignment = {
        horizontal: "left",
        vertical: "middle",
      };

      sheet.getCell(cRange).border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      sheet.getCell(cRange).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ff89d5fb" },
      };
    });

    //populate data from the req.body
    tableData.forEach((item) => {
      const row = sheet.addRow([
        item.d_received,
        item.section,
        item.i_code,
        item.m_name,
        item.unit,
        item.cat,
        item.i_qty,
        item.i_by,
      ]);

      row.eachCell((cell) => {
        cell.font = {
          size: 11,
          name: "Calibri",
        };

        cell.alignment = {
          horizontal: "left",
          vertical: "middle",
        };
      });
    });

    //AUTO FIT COLUMN BASE ON THE CONTENT
    autoFitColumn(sheet);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Consumale data.xlsx",
    );

    //send file stream
    await workbook.xlsx.write(res);
    res.status(200).end();
    /*     res.status(200).json({
      success: true,
      count: tableData.length,
      message: "Successfully exported data",
    }); */
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//---------------------------------------------------------------------------

//ADD MATERIAL SELECT CATEGORY---------------------------------------------------------

export const getAddMaterialsCatergory = async (req, res) => {
  try {
    const result = await conPool.query(`
      SELECT * FROM tbl_masterlist_category
      ORDER BY category ASC
      `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

//---------------------------------------------------------------------------

//INSERT MATERIAL---------------------------------------------------------
export const insertMaterial = async (req, res) => {
  try {
    const { itemCode, suppName, category, itemName, uom, conQty, conUnit } =
      req.body;

    const result = await conPool.query(
      `
      INSERT INTO tbl_masterlist(
      i_code,
      supp,
      cat,
      i_name,
      uom,
      c_qty,
      c_unit
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [itemCode, suppName, category, itemName, uom, conQty, conUnit],
    );

    res.status(200).json({ success: true, message: "Successfully Added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
