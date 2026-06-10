import express from "express";
import {
  checkPassword,
  getSection,
  getStaff,
  getMasterList,
  getAllData,
  insertData,
  deleteSelected,
  updateSelected,
  exportData,
  getAddMaterialsCatergory,
  insertMaterial,
} from "../../../../controllers/PPC/WAREHOUSE/Consumable/Con_Controller.js";

const router = express.Router();

//POST
router.post("/checkpass", checkPassword);
router.post("/insertdata", insertData);
router.post("/exportdata", exportData);
router.post("/insertmaterial", insertMaterial);

//DELETE
router.delete("/deleteselected/:id", deleteSelected);

//PUT
router.put("/updateselected/:editId", updateSelected);

//GET
router.get("/sections", getSection);
router.get("/staffs", getStaff);
router.get("/masterlist", getMasterList);
router.get("/getdata", getAllData);
router.get("/category", getAddMaterialsCatergory);

export default router;
