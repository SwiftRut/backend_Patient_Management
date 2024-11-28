import express from "express";
import { doctor, patient, protect } from "../middlewares/authMiddleware.js";
import {
  createBill,
  deleteBill,
  getBillById,
  getBills,
  getbillsByPatientId,
  updateBill,
  getInsuranceBills,
} from "../controllers/bill.controller.js";
import authorize from "../middlewares/roleMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
const router = express.Router();

// router.post("/createbill" ,upload.single('profilePic'), createBill)
router.post("/createbill", createBill); //
router.get("/getbill", cacheMiddleware, getBills); //
router.get(
  "/getbillsById",
  protect,
  authorize(["patient", "doctor"]),
  cacheMiddleware,
  getbillsByPatientId
); //bill/getbillsById
router.get("/getInsuranceBills", cacheMiddleware, getInsuranceBills);
router.get("/singlebill/:id", cacheMiddleware, getBillById);
router.put("/billupdate/:id", updateBill);
router.delete("/deletebill/:id", deleteBill);
export default router;
