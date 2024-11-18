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
  ReportingAndAnalytics,
} from "../controllers/aggregationContorller.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";

const router = express.Router();

router.get("/doctors/department-count",cacheMiddleware, getDoctorDepartmentCount);
router.get("/patients/department-count",cacheMiddleware, getPatientDepartmentCount);
router.get("/appointments/hospital-count",cacheMiddleware,getAppointmentCountByHospital);
router.get("/patients/age-distribution",cacheMiddleware, getPatientAgeDistribution);
router.get("/patients/total-count",cacheMiddleware, getTotalPatientCount);
router.get("/patients/repeat-count",cacheMiddleware, getRepeatPatientCount);
router.get("/patients/admitted-count",cacheMiddleware, getAdmittedPatientCount);

//chart apis
router.get("/summary-stats",cacheMiddleware, getSummaryStats);
router.get("/patient-statistics",cacheMiddleware, getPatientStatistics);
router.get("/todays-appointments",cacheMiddleware, getTodaysAppointments);
router.get("/patients-summary",cacheMiddleware, getPatientsSummary);
router.get("/pending-bills",cacheMiddleware, getPendingBills);

router.get("/reporting-and-analytics",cacheMiddleware, ReportingAndAnalytics);
export default router;
