import express from "express";

import { receiveRis } from "../../../../controllers/PPC/WAREHOUSE/RIS/Ris_ReceiveController.js";

const router = express.Router();

router.put("/receiveris", receiveRis);

export default router;
