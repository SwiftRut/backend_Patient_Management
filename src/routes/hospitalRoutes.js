import express from "express";
import { createHospital, getAllHospitals } from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/create-hospital", createHospital);
router.get("/get-all-hospitals", getAllHospitals);

export default router;
