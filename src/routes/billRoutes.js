import express from "express";
import { doctor, patient, protect } from "../middlewares/authMiddleware.js";
import {
  createBill,
  deleteBill,
  getBillById,
  getBills,
  updateBill,
} from "../controllers/bill.controller.js";
const router = express.Router();

router.post("/createbill", createBill);
router.get("/getbill", getBills);
router.get("/singlebill/:id", getBillById);
router.put("/billupdate", updateBill);
router.delete("/deletebill", deleteBill);
export default router;
