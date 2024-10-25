import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";
import billModel from "../models/billModel.js";
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

// Returns total patients, total doctors, and today's appointments.
export const getSummaryStats = async (req, res) => {
  try {
    const totalPatients = await patientModel.countDocuments();
    const totalDoctors = await doctorModel.countDocuments();
    const todaysAppointments = await appointmentModel.countDocuments({ 
      date: { $gte: new Date().setHours(0,0,0,0), $lt: new Date().setHours(23,59,59,999) } 
    });

    res.json({ totalPatients, totalDoctors, todaysAppointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Returns daily patient statistics for the current week.
export const getPatientStatistics = async (req, res) => {
  try {
    const startOfWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
    const endOfWeek = new Date(new Date().setDate(new Date().getDate() + (6 - new Date().getDay())));

    const dailyStats = await appointmentModel.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json(dailyStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Returns detailed information about today's appointments.
export const getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await appointmentModel.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).populate('patient', 'name').populate('doctor', 'name').populate('disease', 'name');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Returns a summary of total, new, and old patients.
export const getPatientsSummary = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const totalPatients = await patientModel.countDocuments();
    const newPatients = await patientModel.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const oldPatients = totalPatients - newPatients;

    res.json({ totalPatients, newPatients, oldPatients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Returns a list of pending bills.
export const getPendingBills = async (req, res) => {
  try {
    const pendingBills = await billModel.find({ status: 'Unpaid' })
      .populate('patient', 'name')
      .populate('disease', 'name')
      .limit(50);
    res.json(pendingBills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  getDoctorDepartmentCount,
  getPatientDepartmentCount,
  getAppointmentCountByHospital,
  getPatientAgeDistribution,
  getTotalPatientCount,
  getRepeatPatientCount,
  getAdmittedPatientCount
};
