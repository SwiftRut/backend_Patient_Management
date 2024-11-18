import express from "express";
import { createHospital, getAllHospitals } from "../controllers/hospitalController.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";

const router = express.Router();

router.post("/create-hospital", createHospital);
router.get("/get-all-hospitals",cacheMiddleware, getAllHospitals);

export default router;
