import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import adminModel from "../models/adminModel.js";
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      let user;
      if (decoded.role === "admin") {
        user = await adminModel
          .findById(Types.ObjectId(decoded.id))
          .select("-password");
      } else if (decoded.role === "doctor") {
        console.log("in doctor");
        user = await doctorModel
          .findById(decoded.id)
          .select("-password");
      } else if (decoded.role === "patient") {
        console.log("in patient");
        user = await patientModel
          .findById(decoded.id)
          .select("-password");
      }
      console.log(decoded)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = {user, role: decoded.role};
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

export const doctor = (req, res, next) => {
  console.log(req.user,"<<<<<<<<<<<<<<<<<<< from doctor middleware");
  if (req.user && req.user.role === "doctor") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as doctor" });
  }
};

export const patient = (req, res, next) => {
  if (req.user && req.user.role === "patient") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as patient" });
  }
};
