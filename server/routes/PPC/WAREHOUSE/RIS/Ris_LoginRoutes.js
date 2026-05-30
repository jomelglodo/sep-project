import express from "express";
import { risLogin } from "../../../../controllers/PPC/WAREHOUSE/RIS/Ris_LoginController.js";

const router = express.Router();

router.post("/risLogin", risLogin);

export default router;
