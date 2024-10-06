import express  from "express";
import { doctor, patient, protect } from "../middlewares/authMiddleware.js";
import { AllAppointment,  allpatient,  createAppointment, DeleteAppointment, getDoctorAppointmentHistory,  getPatientAppointmentHistory, SingleAppoiment, singlepatient, UpdateAppointment } from "../controllers/appointmentController.js";
const router = express.Router()

router.post("/appoinmentcreate" , protect , patient , createAppointment)
router.get("/allappoinment" , protect , patient , AllAppointment)
router.put("/updateappointment/:id" , protect , patient , UpdateAppointment)
router.delete("/deleteappointment/:id" , protect , patient , DeleteAppointment)
router.get("/Patient_Appointment_History/:PatientID" , protect , patient , getPatientAppointmentHistory)
router.get("/Doctor_Appointment_History/:DoctorID" , protect , doctor , getDoctorAppointmentHistory)
router.get("/singleappointment/:id" , protect , patient ,SingleAppoiment)
router.get("/allpatient" , protect , doctor , allpatient)
router.get("/singlepatient/:id" , protect , doctor , singlepatient)

export default router;