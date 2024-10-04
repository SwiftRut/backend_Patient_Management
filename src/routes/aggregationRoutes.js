import express from 'express';
import { getDoctorDepartmentCount, getPatientDepartmentCount, getAppointmentCountByHospital, getPatientAgeDistribution, getTotalPatientCount, getRepeatPatientCount, getAdmittedPatientCount } from '../controllers/reportController';

const router = express.Router();

router.get('/doctors/department-count', getDoctorDepartmentCount);
router.get('/patients/department-count', getPatientDepartmentCount);
router.get('/appointments/hospital-count', getAppointmentCountByHospital);
router.get('/patients/age-distribution', getPatientAgeDistribution);
router.get('/patients/total-count', getTotalPatientCount);
router.get('/patients/repeat-count', getRepeatPatientCount);
router.get('/patients/admitted-count', getAdmittedPatientCount);

module.exports = router;
