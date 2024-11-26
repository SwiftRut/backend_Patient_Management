import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";
import bcrypt from "bcryptjs";
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
    const admin = await adminModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

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

    if (patient) {
      return loginPatient(req, res);
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error during universal login:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//logout
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Server error during logout" });
  }
});


const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let user;

router.post("/forgetPassword", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Please provide email or phone number" });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/[\s\-\(\)]/g, "");

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordExpires = otpExpiry;
    await user.save();

    if (identifier.includes("@")) {
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

router.post("/verifyOtp", async (req, res) => {
  try {
    const { otp } = req.body;

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== user.resetPasswordOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

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

    user.password = password;
    user.resetPasswordOtp = "";
    user.resetPasswordExpires = "";
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
