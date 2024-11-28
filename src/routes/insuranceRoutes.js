import express from "express";
import {
  createInsurance,
  deleteInsurance,
  getInsuranceById,
  getInsurances,
  updateInsurance,
} from "../controllers/insuranceController.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
const router = express.Router();

router.post("/craeteindurance", createInsurance);
router.get("/getallinsurance", cacheMiddleware, getInsurances);
router.get("/singleinsurance/:id", cacheMiddleware, getInsuranceById);
router.put("/updateinsurance/:id", updateInsurance);
router.delete("/deleteinsurance", deleteInsurance);

export default router;
