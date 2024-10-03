import express from 'express'
import { createInsurance, deleteInsurance, getInsuranceById, getInsurances, updateInsurance } from "../controllers/insuranceController.js"
const router = express.Router()

router.post("/craeteindurance" , createInsurance)
router.get("/getallinsurance" , getInsurances)
router.get("/singleinsurance/:id" , getInsuranceById)
router.put("/updateinsurance/:id" , updateInsurance)
router.delete("/deleteinsurance" , deleteInsurance)

export default router;