import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";
import hospitalModel from "../models/hospitalModel.js";

//register
export const registerAdmin = async (req, res) => {
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

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const newAdmin = new adminModel({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      state,
      city,
      hospital,
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      newAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//login
export const loginAdmin = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email/phone and password" });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/[\s\-\(\)]/g, "");

    const admin = await adminModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: rememberMe ? "7d" : "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//get profile by id
export const getProfile = async (req, res) => {
  try {
    const adminId = req.params.id;
    console.log(req.params.id);

    const admin = await adminModel
      .findById(adminId)
      .select("-password -confirmPassword")
      .populate("hospital");

    const hospital = await hospitalModel.findById(admin.hospital);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get all admin
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find().select("-password -confirmPassword"); // Exclude sensitive fields
    const adminCount = await adminModel.countDocuments();

    res.status(200).json({
      totalAdmin: adminCount,
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//edit profile
export const editProfile = async (req, res) => {
  try {
    const adminId = req.params.id;
    const updates = req.body;

    if (updates.email) {
      const existingAdminWithEmail = await adminModel.findOne({
        email: updates.email,
        _id: { $ne: adminId },
      });
      if (existingAdminWithEmail) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    if (updates.gender) {
      const allowedGenders = ["male", "female", "other"];
      if (!allowedGenders.includes(updates.gender.toLowerCase())) {
        return res.status(400).json({ message: "Invalid gender value" });
      }
    }

    const updatedAdmin = await adminModel
      .findByIdAndUpdate(
        adminId,
        { $set: updates },
        { new: true, runValidators: true }
      )
      .select("-password -confirmPassword");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const adminId = req.params.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
    }

    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await adminModel.findByIdAndUpdate(adminId, {
      password: hashedNewPassword,
    });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
