import express from "express";
import { doctor, patient, protect } from "../middlewares/authMiddleware.js";
import {
  createBill,
  deleteBill,
  getBillById,
  getBills,
  getbillsById,
  updateBill,
  getInsuranceBills,
} from "../controllers/bill.controller.js";
import upload from "../../cloudinary/multer.js";
import authorize from "../middlewares/roleMiddleware.js";
const router = express.Router();

// router.post("/createbill" ,upload.single('profilePic'), createBill)
router.post("/createbill", createBill);
router.get("/getbill", getBills);
router.get(
  "/getbillsById",
  protect,
  authorize(["patient", "doctor"]),
  getbillsById
);
router.get("/getInsuranceBills", getInsuranceBills);
router.get("/singlebill/:id", getBillById);
router.put("/billupdate/:id", updateBill);
router.delete("/deletebill/:id", deleteBill);
export default router;
