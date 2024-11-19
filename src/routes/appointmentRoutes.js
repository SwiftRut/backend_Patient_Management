import express  from "express";
import { doctor, patient, protect } from "../middlewares/authMiddleware.js";
import { AllAppointment,AllAppointmentsForCount,  allpatient,  appointmentFee,  createAppointment, DeleteAppointment,CancelAppointment, getDoctorAppointmentHistory,  getPatientAppointmentHistory, SingleAppoiment, singlepatient, UpdateAppointment, AllTodaysAppointment,AllAppointmentById, appoinmentDone } from "../controllers/appointmentController.js";
import authorize from "../middlewares/roleMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
const router = express.Router()


//here we have to change the role bbase on the role of the user
router.post("/appoinmentcreate" ,protect, authorize(["patient", "doctor"]), createAppointment)

router.get('/appointment-fee', protect,cacheMiddleware, appointmentFee);
router.get("/allappoinment" , protect,cacheMiddleware, authorize(["patient", "doctor","admin"]), AllAppointment);
router.get("/allAppointmentsForCount" ,cacheMiddleware, protect, authorize(["patient", "doctor","admin"]), AllAppointmentsForCount);
router.get("/allpatient" , protect ,cacheMiddleware, authorize(["patient", "doctor"]) , allpatient);
router.get("/alltodayappoinment" , protect,cacheMiddleware, authorize(["patient", "doctor","admin"]), AllTodaysAppointment);
router.get("/getAllAppointmentById/:id" , protect,cacheMiddleware, authorize(["patient", "doctor","admin"]), AllAppointmentById);
router.get("/Patient_Appointment_History/:PatientID" , protect,cacheMiddleware, authorize(["patient", "doctor"]) , getPatientAppointmentHistory)
router.get("/Doctor_Appointment_History/:id",protect,cacheMiddleware ,authorize(["patient", "doctor"]) , getDoctorAppointmentHistory);
router.get("/singleappointment/:id" , protect ,cacheMiddleware, authorize(["patient", "doctor"]) ,SingleAppoiment);//
router.get("/singlepatient/:id" , protect, cacheMiddleware, authorize(["patient", "doctor"]) , singlepatient);
router.get("/appoinmentDone/:id", protect, cacheMiddleware, appoinmentDone);
router.put("/updateappointment/:id" ,protect, authorize(["patient", "doctor"]), UpdateAppointment)//
router.put("/cancelappointment/:id" ,protect,authorize(["patient", "doctor"]) , CancelAppointment )//

router.delete("/deleteappointment/:id" ,protect,authorize(["patient", "doctor"]) , DeleteAppointment)//
export default router;