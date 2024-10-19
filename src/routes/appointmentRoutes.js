import express  from "express";
import { doctor, patient, protect } from "../middlewares/authMiddleware.js";
import { AllAppointment,  allpatient,  createAppointment, DeleteAppointment, getDoctorAppointmentHistory,  getPatientAppointmentHistory, SingleAppoiment, singlepatient, UpdateAppointment } from "../controllers/appointmentController.js";
import authorize from "../middlewares/roleMiddleware.js";
const router = express.Router()


//here we have to change the role bbase on the role of the user
router.post("/appoinmentcreate" ,protect, authorize(["patient"]), createAppointment)
router.get("/allappoinment" , protect, authorize(["patient", "doctor"]), AllAppointment)
router.put("/updateappointment/:id" ,protect, authorize(["patient", "doctor"]), UpdateAppointment)
router.delete("/deleteappointment/:id" ,protect,authorize(["patient", "doctor"]) , DeleteAppointment)
router.get("/Patient_Appointment_History/:PatientID" , protect, authorize(["patient", "doctor"]) , getPatientAppointmentHistory)
router.get("/Doctor_Appointment_History/:id",protect ,authorize(["patient", "doctor"]) , getDoctorAppointmentHistory);
router.get("/singleappointment/:id" , protect , authorize(["patient", "doctor"]) ,SingleAppoiment);
router.get("/allpatient" , protect , authorize(["patient", "doctor"]) , allpatient);
router.get("/singlepatient/:id" , protect , authorize(["patient", "doctor"]) , singlepatient);

export default router;