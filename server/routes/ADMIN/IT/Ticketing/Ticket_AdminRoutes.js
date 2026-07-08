import express from "express";
import {
  userCounter,
  userList,
  addUser,
  updateUser,
  deleteUser,
} from "../../../../controllers/ADMIN/IT/Ticketing/Ticket_AdminControllers.js";

const router = express.Router();

//GET
router.get("/usercounter", userCounter);
router.get("/userlist", userList);

//PUT
router.put("/updateuser", updateUser);
router.put("/deleteuser/:userId", deleteUser);

//POST
router.post("/adduser", addUser);

export default router;
