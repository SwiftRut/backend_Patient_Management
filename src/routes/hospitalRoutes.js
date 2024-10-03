import express from "express";
import { createHospital } from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/create-hospital", createHospital);

export default router;
