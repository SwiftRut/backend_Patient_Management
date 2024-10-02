import express from "express";
const router = express.Router();

router.use("/patient",require("../routes/patientRoutes.js"))

export default router;