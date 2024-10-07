import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";
import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";
import { loginAdmin } from "../controllers/adminController.js";
import { loginDoctor } from "../controllers/doctorController.js";
import { loginPatient } from "../controllers/patientController.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email/phone and password" });
  }

  try {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/[\s\-\(\)]/g, "");
    // console.log("Normalized Identifier:", normalizedIdentifier);
    // console.log("Normalized Phone:", normalizedPhone);
    const admin = await adminModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });
    console.log("admin", admin);

    if (admin) {
      return loginAdmin(req, res);
    }

    const doctor = await doctorModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (doctor) {
      return loginDoctor(req, res);
    }

    const patient = await patientModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });
    console.log("Patient:", patient);
    console.log("Doctor:", doctor);
    console.log("Admin:", admin);
    if (patient) {
      return loginPatient(req, res);
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error during universal login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let user;

// Forget Password API
router.post("/forgetPassword", async (req, res) => {
  try {
    console.log("sid", process.env.TWILIO_SID);
    console.log("token", process.env.TWILIO_AUTH_TOKEN);

    const { identifier } = req.body;

    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Please provide email or phone number" });
    }

    // Normalize identifier (for email and phone)
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/[\s\-\(\)]/g, "");

    // Search across all models (admin, doctor, patient)
    user = await adminModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (!user) {
      user = await doctorModel.findOne({
        $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
      });
    }

    if (!user) {
      user = await patientModel.findOne({
        $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP and hash it
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    // Save OTP and expiration in the user document
    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordExpires = otpExpiry;
    await user.save();
    console.log("<<user", user);

    // If identifier is email, send OTP via email
    if (identifier.includes("@")) {
      // Define the transporter for email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is: ${otp}. It will expire in 5 minutes.`,
      };

      await transporter.sendMail(mailOptions);
      return res
        .status(200)
        .json({ message: "OTP has been sent to your email" });
    } else {
      // If identifier is phone number, send OTP via SMS using Twilio
      console.log(user.phone);
      await twilioClient.messages.create({
        body: `Your password reset OTP is: ${otp}. It will expire in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone,
      });

      return res
        .status(200)
        .json({ message: "OTP has been sent to your phone" });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP API with timer check
router.post("/verifyOtp", async (req, res) => {
  try {
    const { otp } = req.body;

    // Hash the incoming OTP for comparison
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Compare hashed OTP
    if (hashedOtp !== user.resetPasswordOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified successfully
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Save new password
    user.password = password;
    user.resetPasswordOtp = ""; // Clear OTP after use
    user.resetPasswordExpires = "";
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
