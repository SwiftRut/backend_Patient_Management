import patientModel from "../models/patientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { client } from '../redis.js';
import { CACHE_TIMEOUT } from "../constants.js";
//register patient
export const registerPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      age,
      height,
      weight,
      gender,
      dob,
      bloodGroup,
      phone,
      country,
      state,
      city,
      address,
      diseaseName,
      role,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !age ||
      !height ||
      !weight ||
      !gender ||
      !dob ||
      !bloodGroup ||
      !phone ||
      !country ||
      !state ||
      !address||
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
      age,
      height,
      weight,
      gender,
      dob,
      bloodGroup,
      country,
      state,
      city,
      address,
      diseaseName,
      role: "patient",
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

   
    const normalizedPhone = identifier.trim().replace(/[\s\-\(\)]/g, "");

   
    const patient = await patientModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

   
    const isMatch = await bcrypt.compare(password, patient.password);
   
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: patient._id,role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
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
        role: "patient",
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
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
    const patient = await patientModel.findById(id).populate("appointmentId");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({data: patient}));
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
    const patients = await patientModel.find().populate({
      path: 'appointmentId',
      populate: {
        path: 'doctorId', // Populate doctorId within each appointment
      },
    });
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: patients }));
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

  const imgUrl = req.file ? req.file.path : req.body.avatar;
  if (imgUrl) updatedData.avatar = imgUrl;
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
    await client.del(`/patient/profile/${req.user.id}`);
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
    await client.del(`/patient/profile/${req.user.id}`);
    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
