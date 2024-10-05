import patientModel from "../models/patientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio"; // For sending SMS
import mongoose from "mongoose";

//register patient
export const registerPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      country,
      state,
      city,
      diseaseName,
      role,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !country ||
      !state ||
      !diseaseName ||
      !city
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingPatient = await patientModel.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const newPatient = new patientModel({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      state,
      city,
      diseaseName,
      role: role || "patient",
    });

    await newPatient.save();

    res.status(201).json({
      message: "Patient registered successfully",
      newPatient: newPatient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//login patient

export const loginPatient = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email/phone and password" });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    console.log("Normalized Identifier: ", normalizedIdentifier);

    const normalizedPhone = identifier.trim().replace(/[\s\+\-\(\)]/g, "");

    console.log("Normalized Phone: ", normalizedPhone);

    const patient = await patientModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Patient found:", patient);

    const isMatch = await bcrypt.compare(password, patient.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" } // 'Remember Me' for 7 days, otherwise 1 day
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        role:'patient',
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//forgot password
// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Please provide email or phone number" });
    }

    // Find the patient by email or phone
    const patient = await patientModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save OTP and expiry in the patient record
    patient.resetPasswordOtp = hashedOtp;
    patient.resetPasswordExpires = otpExpiry;
    await patient.save();

    // If email is provided, send the OTP via email using nodemailer
    if (identifier.includes("@")) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: patient.email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      return res
        .status(200)
        .json({ message: "OTP has been sent to your email" });
    } else {
      // If phone is provided, send OTP via SMS using Twilio
      await twilioClient.messages.create({
        body: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: patient.phone,
      });

      return res
        .status(200)
        .json({ message: "OTP has been sent to your phone" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide a new password and confirmation" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const patient = await patientModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token has expired
    });

    if (!patient) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(password, salt);
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpires = undefined;

    await patient.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//add patient
export const addPatient = async (req, res) => {
  const { email, phone, password, confirmPassword } = req.body;

  try {
    const existingPatient = await patientModel.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingPatient) {
      return res.status(400).json({
        message: "Patient with this email or phone number already exists",
      });
    }

    const newPatient = new patientModel(req.body);
    await newPatient.save();

    res.status(201).json({
      message: "Patient added successfully",
      data: newPatient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get patient by id
export const getPatientById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
  }

  try {
    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all patient
export const getAllPatients = async (req, res) => {
  try {
    const patients = await patientModel.find();
    res.status(200).json({
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//edit patient by id
export const editPatient = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
  }

  try {
    const patient = await patientModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete patient by id
export const deletePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
  }

  try {
    const patient = await patientModel.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
