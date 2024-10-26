import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";
import Razorpay from 'razorpay';

// appointment fee
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const appointmentFee = async (req, res) => {
  const { doctorId, appointmentType } = req.query;
  console.log(`Appointment fee for doctor ${doctorId} and type ${appointmentType}`);
  try {
    // const doctor = await Doctor.findById(doctorId);
    // let fee = doctor.consultationFee;
    let fee = 1000; // You might want to replace this with actual doctor's fee in the future
    if (appointmentType === 'follow_up' || true) {
      fee *= 0.8;
    }
    res.json({ fee });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointment fee' });
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
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
};

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
      hospitalId = null,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
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
      dieseas_name,
      appointmentTime: start,
      hospitalId,
      country,
      city,
      type,
      state,
      // paymentId: razorpayPaymentId,
      // orderId: razorpayOrderId,
      paymentStatus: 'paid'
    });

    await newAppointment.save();

    patient.appointmentId = patient.appointmentId || [];
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

export const AllAppointmentById = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await appointmentModel
      .find({
        patientId: req.user.id || id,
      })
      .populate("patientId doctorId");
      
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const AllTodaysAppointment = async(req, res) => {
  try {
    let data = await appointmentModel
      .find({
        // date: new Date().      [0]
      })
      .populate("patientId doctorId");
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

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

//cancel appointment
export const CancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
      const appointment = await appointmentModel.findByIdAndUpdate(
          id,
          { status: 'canceled' },
          { new: true }
      );

      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      res.status(200).json({ message: 'Appointment canceled successfully', data: appointment });
  } catch (error) {
      res.status(500).json({ message: error.message });
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
    const SingleAppoiment = await appointmentModel.findById(id)
      .populate({
        path: "patientId",
        select: "firstName lastName phonenumber gender age address ",
      })
      .populate({ path: "doctorId", select: "name" })
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
