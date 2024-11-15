import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";
import billModel from "../models/billModel.js";
import { patient } from "../middlewares/authMiddleware.js";
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
export const ReportingAndAnalytics = async (req, res) => {
  try {
    const totalPatientCount = await patientModel.countDocuments();
    
    // Use aggregation for repeatPatientCount
    const repeatPatientAggregation = await appointmentModel.aggregate([
      {
        $group: {
          _id: '$patientId',
          count: { $sum: 1 },
        },
      },
      {
        $match: { count: { $gt: 1 } },
      },
      {
        $count: 'repeatPatientCount'
      }
    ]);

    // Extract the count result (if no repeat patients, set to 0)
    const repeatPatientCount = repeatPatientAggregation[0] ? repeatPatientAggregation[0].repeatPatientCount : 0;
    
    const totalDoctorCount = await doctorModel.countDocuments();
    const totalAppointmentCount = await appointmentModel.countDocuments();
    const insuranceClaimCount = await billModel.find({ paymentType: "Insurance" }).countDocuments();

    //create an object in which it will contain the all the diases name and its patient count useing the appointment model
    const patientCountByDisease = await appointmentModel.aggregate([
      {
        $group: {
          _id: '$dieseas_name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    //create an object in which we have the doctor count by department (speciality)
    const doctorCountByDepartment = await doctorModel.aggregate([
      {
        $group: {
          _id: "$speciality",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    //create an array which contains the percentage of the patient with different age ranges
    const ageGroups = {
      "0-2 Years": 0,
      "3-12 Years": 0,
      "13-19 Years": 0,
      "20-39 Years": 0,
      "40-59 Years": 0,
      "60 And Above": 0,
    };
    //get all the patinets
    const patients = await patientModel.find({});
    patients.forEach((patient) => {
      const age = patient.age;
      if (age <= 2) ageGroups["0-2 Years"]++;
      else if (age <= 12) ageGroups["3-12 Years"]++;
      else if (age <= 19) ageGroups["13-19 Years"]++;
      else if (age <= 39) ageGroups["20-39 Years"]++;
      else if (age <= 59) ageGroups["40-59 Years"]++;
      else ageGroups["60 And Above"]++;
    });
    const ageRangePercentage = Object.keys(ageGroups).map((key, index) => ({
      name: key,
      value: ageGroups[key],
      color:
        index < 6
          ? [
              "#F65D79",
              "#506EF2",
              "#51D2A6",
              "#F6A52D",
              "#FACF2E",
              "#9253E1",
            ][index]
          : "#8884d8", // Default color if not provided
    }));
    //yearly data
    const yearlyData = Array(12)
      .fill(0)
      .map((_, index) => ({
        month: new Date(0, index).toLocaleString("default", { month: "short" }),
        onlineConsultation: 0,
        otherAppointment: 0,
      }));
    //current month
    const currentMonth = new Date().getMonth();
    const monthlyData = {
      month: new Date().toLocaleString("default", { month: "short" }),
      onlineConsultation: 0,
      otherAppointment: 0,
    };
    patients.forEach((patient) => {
      const appointmentDate = new Date(patient.createdAt);
      const monthIndex = appointmentDate.getMonth();
      if (isNaN(appointmentDate.getTime())) {
        console.warn("Invalid appointment date:", patient.createdAt);
        return;
      }
      if (monthIndex >= 0 && monthIndex < 12) {
        yearlyData[monthIndex].otherAppointment++;
      }
      if (appointmentDate.getMonth() === currentMonth) {
        monthlyData.otherAppointment++;
      }
    });
    const finalYearlyData = yearlyData;
    const finalMonthlyData = [monthlyData]; 
    
     // Initialize data structures for weekly and daily data
     const weeklyPatients = Array(7).fill(0).map((_, index) => ({
       day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
       newPatient: 0,
       oldPatient: 0,
     }));

     const dailyPatients = Array(24).fill(0).map((_, index) => ({
       hour: `${index} ${index < 12 ? 'AM' : 'PM'}`,
       newPatient: 0,
       oldPatient: 0,
     }));

     const currentDate = new Date();
     
     // Process each patient to categorize by day and hour from all patients
     patients.forEach(patient => {
       const registrationDate = new Date(patient.createdAt);
       const dayOfWeek = registrationDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
       const hourOfDay = registrationDate.getHours();

       if (registrationDate > currentDate) {
         // New patient
         if (dayOfWeek > 0) {
           weeklyPatients[dayOfWeek - 1].newPatient++;
         }
         if (hourOfDay >= 0) {
           dailyPatients[hourOfDay].newPatient++;
         }
       } else {
         // Old patient
         if (dayOfWeek > 0) {
           weeklyPatients[dayOfWeek - 1].oldPatient++;
         }
         if (hourOfDay >= 0) {
           dailyPatients[hourOfDay].oldPatient++;
         }
       }
     });



    res.json({
      totalPatientCount,
      repeatPatientCount,
      totalDoctorCount,
      totalAppointmentCount,
      insuranceClaimCount,
      patientCountByDisease,
      doctorCountByDepartment,
      ageRangePercentage,
      finalYearlyData,
      finalMonthlyData,
      currentMonth,
      monthlyData,
      yearlyData,
      weeklyPatients,
      dailyPatients
    });
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
  getAdmittedPatientCount,
};
