import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";

// create appoinment
export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      patient_issue,
      dieseas_name,
      start,
      country,
      city,
      state,
      type,
      hospitalId = null, // default to null if not provided
    } = req.body;
    console.log(req.user)
    const patient = await patientModel.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const conflictingAppointment = await appointmentModel.findOne({
      patientId: req.user.id,
      doctorId,
      date,
      appointmentTime: start,
      status: { $ne: "cancelled" },
    });

    if (conflictingAppointment) {
      return res
        .status(400)
        .json({ message: "Doctor is not available at this time" });
    }

    // Creating new appointment
    const newAppointment = new appointmentModel({
      patientId: req.user.id,
      doctorId,
      date,
      patient_issue,
      dieseas_name,
      appointmentTime: start,
      hospitalId, // Optional field with default
      country,
      city,
      type,
      state,
    });

    await newAppointment.save();
    // Update patient's appointments array
    patient.appointmentId = patient.appointmentId || []; // ensure it’s an array
    patient.appointmentId.push(newAppointment._id);
    await patient.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// all appoinment - shoud work for both patient and doctor based on token role
export const AllAppointment = async (req, res) => {
  try {
    console.log(req.user,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    let data = await appointmentModel
      .find({
        patientId: req.user.id,
      })
      .populate("patientId doctorId");
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// update appointment
export const UpdateAppointment = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await appointmentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ message: "update succesfully", data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// delete appointment
export const DeleteAppointment = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await appointmentModel.findByIdAndDelete(id);
    res.json({ message: "Delete succesfully", data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// fetch appointment for patient selected user
export const getPatientAppointmentHistory = async (req, res) => {
  try {
    const { PatientID } = req.params;

    const appointmentHistory = await appointmentModel
      .find({ patientId:PatientID })
      .populate("doctorId", "name specialtiyType") // Populates doctor information
      .sort({ appointmentdate: -1 }); // Sort by date (most recent first)

    res
      .status(200)
      .json({
        message: "Patient appointment history",
        data: appointmentHistory,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch appoinment for doctor
export const getDoctorAppointmentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const appointmentHistory = await appointmentModel.find({ doctorId: id }).populate('patientId doctorId');
    res
      .status(200)
      .json({
        message: "Doctor appointment history",
        data: appointmentHistory,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// single appoinment
export const SingleAppoiment = async (req, res) => {
  try {
    let { id } = req.params;
    const SingleAppoiment = await AppointmentModel.findById(id)
      .populate({
        path: "patientId",
        select: "firstname lastname phonenumber gender age address",
      })
      .populate({ path: "doctorId", select: "DoctorName" })
      .populate({ path: "hospitalId" })
      .populate({ path: "insuranceId" });
    res.json(SingleAppoiment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// all patint for doctor
export const allpatient = async (req, res) => {
  try {
    let data = await patientModel.find();
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// doctor click patient record
export const singlepatient = async (req, res) => {
  try {
    let { id } = req.params;

    let patient = await patientModel.findById(id).populate("appointmentId");
    res.status(200).json({ data: patient });
  } catch (error) {
    req.status(400).json({ error: error.message });
  }
};
