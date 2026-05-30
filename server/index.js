import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { risPool } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

//RIS ROUTES

import RisRoutes from "./routes/PPC/WAREHOUSE/RIS/RisRoutes.js";
import Ris_LoginRoutes from "./routes/PPC/WAREHOUSE/RIS/Ris_LoginRoutes.js";
import Ris_ManagementRoutes from "./routes/PPC/WAREHOUSE/RIS/Ris_ManagementRoutes.js";
import Ris_ReceiveRoutes from "./routes/PPC/WAREHOUSE/RIS/Ris_ReceiveRoutes.js";

//import "./config.js";

//REGISTER ROUTES

//PPC - RIS
app.use("/ris", RisRoutes);
app.use("/ris", Ris_LoginRoutes);
app.use("/ris/management", Ris_ManagementRoutes);
app.use("/ris/receive", Ris_ReceiveRoutes);

//Serve React static files (manual copying of build folder inside the client folder)
//app.use(express.static(path.join(__dirname, "build")));

// save react static files directly inside the client folder
app.use(express.static(path.join(__dirname, "../client/build")));

//SPA fallback(Important for React Router)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});

/* app.get("/test", async (req, res) => {
  const result = await pool.query("SELECT * FROM tbl_warehousestaff");
  res.json(result.rows);
  console.log(result.rows);
}); */

/* RIS GET SECTIONS */
/* app.get("/sections", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT section FROM tbl_section ORDER BY section ASC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
}); */

/* RIS LOGIN VERIFICATION */
/* app.post("/risLogin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
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
}); */
