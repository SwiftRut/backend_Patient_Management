import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const registerDoctor = async (req, res) => {
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
      hospital,
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
      !city
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const newDoctor = new doctorModel({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      state,
      city,
      hospital,
      role: "doctor",
    });

    await newDoctor.save();

    res.status(201).json({
      message: "Doctor registered successfully",
      newDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//login doctor
export const loginDoctor = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email/phone and password" });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/[\s\+\-\(\)]/g, "");

    const doctor = await doctorModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "7d" : "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phone: doctor.phone,
      },
    });
  } catch (error) {
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

    const doctor = await doctorModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpires = undefined;

    await doctor.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//add doctor
export const addDoctor = async (req, res) => {
  try {
    const existingDoctor = await doctorModel.findOne({ email: req.body.email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    const newDoctor = new doctorModel(req.body);
    await newDoctor.save();

    res.status(201).json({
      message: "Doctor added successfully",
      data: newDoctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get doctor by id
export const getDoctorById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }

  try {
    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).json({
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//edit doctor
export const editDoctor = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }

  try {
    const doctor = await doctorModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete doctor
export const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }

  try {
    const doctor = await doctorModel.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
