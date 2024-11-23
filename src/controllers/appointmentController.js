import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";
import Razorpay from "razorpay";
import { CACHE_TIMEOUT } from "../constants.js";
import { client } from "../redis.js";
import { sendSMS } from "../services/SendSMS.js"

// appointment fee
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const CACHE_KEYS = {
  ALL_APPOINTMENTS: "/appoinment/allappointment",
  ALL_APPOINTMENTS_COUNT: "/appoinment/allAppointmentsForCount",
  ALL_PATIENTS: "/appoinment/allpatient",
  TODAY_APPOINTMENTS: "/appoinment/alltodayappointment",
  APPOINTMENT_BY_ID: (id) => `/appoinment/getAllAppointmentById/${id}`,
  PATIENT_HISTORY: (id) => `/appoinment/Patient_Appointment_History/${id}`,
  DOCTOR_HISTORY: (id) => `/appoinment/Doctor_Appointment_History/${id}`,
  SINGLE_APPOINTMENT: (id) => `/appoinment/singleappointment/${id}`,
  SINGLE_PATIENT: (id) => `/appoinment/singlepatient/${id}`,
  APPOINTMENT_DONE: (id) => `/appoinment/appoinmentDone/${id}`,
  APPOINTMENT_FEE: (doctorId, type) =>
    `/appoinment/appointment-fee?doctorId=${doctorId}&appointmentType=${type}`,
};

//fucntion to invalidate the querys from the cache_keys
export const invalidateCache = async (id) => {
  try {
    await client.del(CACHE_KEYS.ALL_APPOINTMENTS);
    await client.del(CACHE_KEYS.ALL_APPOINTMENTS_COUNT);
    await client.del(CACHE_KEYS.ALL_PATIENTS);
    await client.del(CACHE_KEYS.TODAY_APPOINTMENTS);
    await client.del(CACHE_KEYS.APPOINTMENT_BY_ID(id));
    await client.del(CACHE_KEYS.PATIENT_HISTORY(id));
    await client.del(CACHE_KEYS.DOCTOR_HISTORY(id));
    await client.del(CACHE_KEYS.SINGLE_APPOINTMENT(id));
    await client.del(CACHE_KEYS.SINGLE_PATIENT(id));
    await client.del(CACHE_KEYS.APPOINTMENT_DONE(id));
    await client.del(CACHE_KEYS.APPOINTMENT_FEE(id));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const appointmentFee = async (req, res) => {
  const { doctorId, appointmentType } = req.query;
  console.log(
    `Appointment fee for doctor ${doctorId} and type ${appointmentType}`
  );
  try {
    // const doctor = await Doctor.findById(doctorId);
    // let fee = doctor.consultationFee;
    let fee = 1000; // You might want to replace this with actual doctor's fee in the future
    if (appointmentType === "follow_up" || true) {
      fee *= 0.8;
    }
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ fee }));
    res.json({ fee });
  } catch (error) {
    res.status(500).json({ error: "Error fetching appointment fee" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      patient_issue,
      diseaseName: dieseas_name,
      start,
      country,
      city,
      state,
      type,
      hospitalId = null,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const patient = await patientModel.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Verify Razorpay payment
    // const generatedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    //   .update(razorpayOrderId + "|" + razorpayPaymentId)
    //   .digest("hex");

    // if (generatedSignature !== razorpaySignature) {
    //   return res.status(400).json({ message: "Invalid payment signature" });
    // }

    // const conflictingAppointment = await appointmentModel.findOne({
    //   patientId: req.user.id,
    //   doctorId,
    //   date,
    //   appointmentTime: start,
    //   status: { $ne: "cancelled" },
    // });

    // if (conflictingAppointment) {
    //   return res
    //     .status(400)
    //     .json({ message: "Doctor is not available at this time" });
    // }

    // Creating new appointment
    const newAppointment = new appointmentModel({
      patientId: req.user.id,
      doctorId,
      date,
      patient_issue,
      dieseas_name: req.body.filteredData.diseaseName,
      appointmentTime: start,
      hospitalId,
      country,
      city,
      type,
      state,
      // paymentId: razorpayPaymentId,
      // orderId: razorpayOrderId,
      paymentStatus: "paid",
    });

    await newAppointment.save();
    console.log(newAppointment, req.body);
    patient.appointmentId = patient.appointmentId || [];
    patient.appointmentId.push(newAppointment._id);
    await patient.save();
    invalidateCache(req.user.id);

    // Send SMS Notification
    const message = `Dear ${patient.firstName}, your appointment with Dr. ${doctorId} on ${date} at ${start} has been confirmed.`;
    try {
      await sendSMS(patient.phone, message);
      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Failed to send SMS:', error.message);
    }

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
export const AllAppointmentsForCount = async (req, res) => {
  try {
    let data = await appointmentModel.find({});
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(data));
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const AllAppointment = async (req, res) => {
  try {
    let data = await appointmentModel
      .find({
        patientId: req.user.id,
      })
      .populate("patientId doctorId");
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(data));

    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const AllAppointmentById = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await appointmentModel
      .find({
        patientId: req.user.id || id,
      })
      .populate("patientId doctorId");
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(data));
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const AllTodaysAppointment = async (req, res) => {
  try {
    //date is will conatient he  value like this 2024-10-27T15:06:00.000Z but we have to return the data with today's date
    //so we have to get the date from the req.originalUrl
    let data = await appointmentModel
      .find({
        // date: new Date().toISOString().split('T')[0]
      })
      .populate("patientId doctorId");
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(data));
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
    invalidateCache(id);
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
    invalidateCache(id);
    invalidateCache(req.user.id);
    res.json({ message: "Delete succesfully", data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//cancel appointment
export const CancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "canceled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    invalidateCache(id);
    invalidateCache(req.user.id);
    res
      .status(200)
      .json({
        message: "Appointment canceled successfully",
        data: appointment,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch appointment for patient selected user
export const getPatientAppointmentHistory = async (req, res) => {
  try {
    const { PatientID } = req.params;

    const appointmentHistory = await appointmentModel
      .find({ patientId: PatientID })
      .populate({ path: "doctorId", populate: { path: "hospitalId" } }) // Populates doctor information
      .sort({ appointmentdate: -1 }); // Sort by date (most recent first)
    const key = req.originalUrl;
    await client.setEx(
      key,
      CACHE_TIMEOUT,
      JSON.stringify({ data: appointmentHistory })
    );
    res.status(200).json({
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
    const appointmentHistory = await appointmentModel
      .find({ doctorId: id })
      .populate("patientId doctorId");
    const key = req.originalUrl;
    await client.setEx(
      key,
      CACHE_TIMEOUT,
      JSON.stringify({ data: appointmentHistory })
    );
    res.status(200).json({
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
    const SingleAppoiment = await appointmentModel
      .findById(id)
      .populate({
        path: "patientId",
        select: "firstName lastName phonenumber gender age address ",
      })
      .populate({ path: "doctorId" })
      .populate({ path: "insuranceId" });
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(SingleAppoiment));
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
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: data }));
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
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: patient }));
    res.status(200).json({ data: patient });
  } catch (error) {
    req.status(400).json({ error: error.message });
  }
};

export const appoinmentDone = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const appointment = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    );
    const key = req.originalUrl;
    await client.setEx(
      key,
      CACHE_TIMEOUT,
      JSON.stringify({
        message: "Appointment status updated successfully",
        data: appointment,
      })
    );
    res
      .status(200)
      .json({
        message: "Appointment status updated successfully",
        data: appointment,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
