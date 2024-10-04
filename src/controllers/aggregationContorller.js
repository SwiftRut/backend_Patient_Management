import patientModel from "../models/patientModel";
import doctorModel from "../models/doctorModel";
import appointmentModel from "../models/appointmentModel";

// Controller function to get doctor count by department (speciality)
const getDoctorDepartmentCount = async (req, res) => {
  try {
    const result = await doctorModel.aggregate([
      {
        $group: {
          _id: "$speciality",
          count: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get patient count by department (disease)
const getPatientDepartmentCount = async (req, res) => {
  try {
    const result = await patientModel.aggregate([
      {
        $group: {
          _id: "$diseaseName",
          count: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get appointment count by hospital/admin
const getAppointmentCountByHospital = async (req, res) => {
  try {
    const result = await appointmentModel.aggregate([
      {
        $group: {
          _id: "$hospitalId",
          count: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get patient age distribution (for donut chart)
const getPatientAgeDistribution = async (req, res) => {
  try {
    const result = await patientModel.aggregate([
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 30, 45, 60, 80, 100],
          default: "Other",
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get total patient count
const getTotalPatientCount = async (req, res) => {
  try {
    const count = await patientModel.countDocuments();
    res.status(200).json({ totalPatients: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get repeat patient count
const getRepeatPatientCount = async (req, res) => {
  try {
    const result = await appointmentModel.aggregate([
      {
        $group: {
          _id: "$patientId",
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      },
      {
        $count: "repeatPatients"
      }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get admitted patient count
const getAdmittedPatientCount = async (req, res) => {
  try {
    const count = await patientModel.countDocuments({ admitted: true });
    res.status(200).json({ admittedPatients: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getDoctorDepartmentCount,
  getPatientDepartmentCount,
  getAppointmentCountByHospital,
  getPatientAgeDistribution,
  getTotalPatientCount,
  getRepeatPatientCount,
  getAdmittedPatientCount
};
