import express from "express";
import {
  getDoctorDepartmentCount,
  getPatientDepartmentCount,
  getAppointmentCountByHospital,
  getPatientAgeDistribution,
  getTotalPatientCount,
  getRepeatPatientCount,
  getAdmittedPatientCount,
  getSummaryStats,
  getPatientStatistics,
  getTodaysAppointments,
  getPatientsSummary,
  getPendingBills,
} from "../controllers/aggregationContorller.js";

const router = express.Router();

router.get("/doctors/department-count", getDoctorDepartmentCount);
router.get("/patients/department-count", getPatientDepartmentCount);
router.get("/appointments/hospital-count", getAppointmentCountByHospital);
router.get("/patients/age-distribution", getPatientAgeDistribution);
router.get("/patients/total-count", getTotalPatientCount);
router.get("/patients/repeat-count", getRepeatPatientCount);
router.get("/patients/admitted-count", getAdmittedPatientCount);

//chart apis
router.get("/summary-stats", getSummaryStats);
router.get("/patient-statistics", getPatientStatistics);
router.get("/todays-appointments", getTodaysAppointments);
router.get("/patients-summary", getPatientsSummary);
router.get("/pending-bills", getPendingBills);
export default router;
