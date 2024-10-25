import express from 'express'
import { doctor, patient, protect } from '../middlewares/authMiddleware.js';
import { createBill, deleteBill, getBillById, getBills, updateBill ,getInsuranceBills} from '../controllers/bill.controller.js';
import upload from '../../cloudinary/multer.js';
const router = express.Router()

// router.post("/createbill" ,upload.single('profilePic'), createBill)
router.post("/createbill", createBill)
router.get("/getbill" , getBills)
router.get("/getInsuranceBills" , getInsuranceBills)
router.get("/singlebill/:id" , getBillById)
router.put("/billupdate/:id" , updateBill)
router.delete("/deletebill/:id" , deleteBill)
export default router;
