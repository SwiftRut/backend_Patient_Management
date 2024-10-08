import patientModel from "../models/patientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

    const normalizedPhone = identifier.trim().replace(/[\s\-\(\)]/g, "");

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
