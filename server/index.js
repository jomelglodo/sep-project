/* import dotenv from "dotenv";
dotenv.config(); */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { risPool, conPool, ticketPool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ========================
   MIDDLEWARE
======================== */

app.use(cors());
//app.use(express.json());
app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  }),
);
//PPC-WAREHOUSE

//RIS ROUTES-------------------------------------------------------------------------

import RisRoutes from "./routes/PPC/WAREHOUSE/RIS/RisRoutes.js";
import Ris_LoginRoutes from "./routes/PPC/WAREHOUSE/RIS/Ris_LoginRoutes.js";
import Ris_ManagementRoutes from "./routes/PPC/WAREHOUSE/RIS/Ris_ManagementRoutes.js";
import Ris_ReceiveRoutes from "./routes/PPC/WAREHOUSE/RIS/Ris_ReceiveRoutes.js";

//------------------------------------------------------------------------------------

//COMSUMABLE ROUTES--------------------------------------------------------------------

import Con_LoginRoutes from "./routes/PPC/WAREHOUSE/Consumable/Con_Routes.js";

//-------------------------------------------------------------------------------------

//TICKETING ROUTES--------------------------------------------------------------------
import Ticket_MainRoutes from "./routes/ADMIN/IT/Ticketing/Ticket_MainRoutes.js";
import Ticket_LoginRoutes from "./routes/ADMIN/IT/Ticketing/Ticket_LoginRoutes.js";
import Ticket_UserRoutes from "./routes/ADMIN/IT/Ticketing/Ticket_UserRoutes.js";
import Ticket_StaffRoutes from "./routes/ADMIN/IT/Ticketing/Ticket_StaffRoutes.js";

//-------------------------------------------------------------------------------------

// =========================================================
// DATABASE CONNECTION TEST
// =========================================================

risPool
  .connect()
  .then((client) => {
    console.log("RIS Database Connected");
    client.release();
  })
  .catch((err) => {
    console.error("RIS Database Connection Error: ", err);
  });

conPool
  .connect()
  .then((client) => {
    console.log("Consumable Database Connected");
  })
  .catch((err) => {
    console.error("Consumable Database Connection Error: ", err);
  });

ticketPool
  .connect()
  .then((client) => {
    console.log("Ticketing Database Connected");
  })
  .catch((err) => {
    console.error("Ticketing Database Connection Error : ", err);
  });

//import "./config.js";

//REGISTER ROUTES

//PPC - WAREHOUSE - RIS
app.use("/ris", RisRoutes);
app.use("/ris", Ris_LoginRoutes);
app.use("/ris/management", Ris_ManagementRoutes);
app.use("/ris/receive", Ris_ReceiveRoutes);

//PPC - WAREHOUSE - CONSUMABLE
app.use("/con", Con_LoginRoutes);

//ADMIN - IT - Ticketing
app.use("/ticketing/main", Ticket_MainRoutes);
app.use("/ticketing/login", Ticket_LoginRoutes);
app.use("/ticketing/user", Ticket_UserRoutes);
app.use("/ticketing/staff", Ticket_StaffRoutes);

// app.get("/test", (req, res) => {
//   res.json({ ok: true, time: Date.now() });
// });

// save react static files directly inside the client folder
//app.use(express.static(path.join(__dirname, "../client/build")));

const buildPath = path.join(__dirname, "../client/build");

//save react static files directly inside the client folder
//app.use(express.static(buildPath));

//SPA fallback(Important for React Router)
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(buildPath, "index.html"));
// });

// =========================================================
// GLOBAL ERROR HANDLERS
// =========================================================

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION: ", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION: ", err);
});

// =========================================================
// GRACEFUL SHUTDOWN
// =========================================================

process.on("SIGINT", async () => {
  console.log("Closing database pools...");

  try {
    await risPool.end();
    console.log("RIS Pool Closed");

    await conPool.end();
    console.log("Consumable Pool Closed");

    await ticketPool.end();
    console.log("Ticket Pool Closed");
  } catch (err) {
    console.error("Error Closing Pools:", err);
  } finally {
    process.exit(0);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});
