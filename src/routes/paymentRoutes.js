import express from "express";
import { pay } from "../controllers/paymentController.js";
const router = express.Router()

router.post("/pay" , pay)

export default router
