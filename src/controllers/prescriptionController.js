import appointmentModel from "../models/appointmentModel.js";
import prescriptionModel from "../models/prescriptionModel.js";

const CACHE_KEYS = {
  PRESCRIPTION_BY_ID: (id) => `/prescription/getPrescriptionById/${id}`,
  ALL_PRESCRIPTIONS: "/prescription/getPrescription",
  TODAY_PRESCRIPTIONS: "/prescription/todayPrescription",
  OLD_PRESCRIPTIONS: "/prescription/oldPrescription",
  SEARCH_PRESCRIPTIONS: "/prescription/searchprescriptions",
  SEARCHING_DATE: "/prescription/searchingdate",
  SINGLE_PRESCRIPTION: (id) => `/prescription/SinglePrescription/${id}`,
};
const invalidateCache = async (id) => {
  try {
    await client.del(CACHE_KEYS.ALL_PRESCRIPTIONS);
    await client.del(CACHE_KEYS.TODAY_PRESCRIPTIONS);
    await client.del(CACHE_KEYS.OLD_PRESCRIPTIONS);
    await client.del(CACHE_KEYS.SEARCH_PRESCRIPTIONS);
    await client.del(CACHE_KEYS.SEARCHING_DATE);
    await client.del(CACHE_KEYS.SINGLE_PRESCRIPTION(id));
  } catch (error) {
    console.log(error);
  }
};
// create prescripition
export const AddPriscription = async (req, res) => {
  try {
    let { id } = req.params;
    let { medicines, note, additionalNote, patientId } = req.body;
    if (id) {
      let Appointment = await appointmentModel
        .findById(id)
        .populate({ path: "patientId", select: "id" });

      const prescription = new prescriptionModel({
        patientId: Appointment.patientId._id,
        doctorId: Appointment.doctorId._id,
        appointmentId: Appointment._id,
        medications: [...medicines],
        instructions: additionalNote,
      });
      await prescription.save();

      //find the appointment and update the prescriptionID
      const appointment = await appointmentModel.findById(id);
      appointment.prescriptionId = prescription._id;
      await appointment.save();
      invalidateCache(id);
      // Return success response
      res.status(201).json({
        message: "Prescription created successfully",
        prescription,
      });
    } else {
      res.json("Appointment not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//get prescripition
export const getPrescription = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await prescriptionModel
      .find({
        // AppointmentID: id,
        // DoctorID: req.body.DoctorID,
      })
      .populate("patientId");
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//get prescriptiopn by patient id
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescriptions = await prescriptionModel
      .find({ patientId: id })
      .populate({
        path: "appointmentId",
        populate: {
          path: "doctorId",
        },
      })
      .populate({
        path: "patientId",
      })
      .populate({
        path: "doctorId",
      })
      .lean(); // Use lean() for better performance if you don't need Mongoose documents

    if (!prescriptions || prescriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No prescriptions found for this patient" });
    }

    res.json(prescriptions);
  } catch (error) {
    console.error("Error in getPrescriptionById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// today prescription
export const getTodaysPrescriptions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prescriptions = await prescriptionModel
      .find({
        date: today,
      })
      .populate("PatientID DoctorID AppointmentID");

    if (prescriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No prescriptions found for today" });
    }

    res.status(200).json({ prescriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// old prescription
export const getOldPrescriptions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prescriptions = await prescriptionModel
      .find({
        date: { $lt: today },
      })
      .populate({
        path: "PatientID",
        select: "firstname lastname phonenumber age gender",
      })
      .populate({ path: "DoctorID", select: "DoctorName" })
      .populate({
        path: "AppointmentID",
        select: "appointmentdate appointmentTime",
      });

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "No old prescriptions found" });
    }

    res.status(200).json({ prescriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//filter by name
export const searchPrescriptionsByPatientName = async (req, res) => {
  try {
    const { name } = req.query; // Search query parameter

    if (!name) {
      return res
        .status(400)
        .json({ message: "Patient name is required for search" });
    }

    // Use regex to perform a case-insensitive search for the name in both firstname and lastname
    const prescriptions = await prescriptionModel
      .find()
      .populate({
        path: "patientId",
        match: {
          $or: [
            { firstname: { $regex: name, $options: "i" } }, // Case-insensitive match for firstname
            { lastname: { $regex: name, $options: "i" } }, // Case-insensitive match for lastname
          ],
        },
        select: "firstname lastname phonenumber age gender", // Select relevant fields to return
      })
      .populate({ path: "doctorId", select: "DoctorName" }) // Populate doctor details
      .populate({
        path: "appointmentId",
        select: "appointmentdate appointmentTime",
      }); // Populate appointment details

    // Filter out results where PatientID is null (no match found)
    const filteredPrescriptions = prescriptions.filter(
      (prescription) => prescription.patientId
    );

    if (filteredPrescriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No prescriptions found for the given patient name" });
    }

    res.status(200).json({ prescriptions: filteredPrescriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// filter date
export const getPrescriptionsByDate = async (req, res) => {
  try {
    const { date } = req.query; // Get the date from query parameters

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

    const prescriptions = await prescriptionModel
      .find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .populate({
        path: "patientId",
        select: "firstname lastname phonenumber age gender",
      })
      .populate({ path: "doctorId", select: "DoctorName" })
      .populate({
        path: "appointmentId",
        select: "appointmentdate appointmentTime",
      });

    if (prescriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No prescriptions found for the given date" });
    }

    res.status(200).json({ prescriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// single prescription
export const SinglePrescription = async (req, res) => {
  try {
    let { id } = req.params;
    const SinglePrescription = await PrescriptionModel.findById(id)
      .populate({
        path: "patientId",
        select: "firstname lastname gender age address",
      })
      .populate({ path: "doctorId", select: "DoctorName HospitalName" });
    res.json(SinglePrescription);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
