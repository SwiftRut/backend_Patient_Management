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

      let user;
      if (decoded.role === "admin") {
        user = await adminModel
          .findById(Types.ObjectId(decoded.id))
          .select("-password");
      } else if (decoded.role === "doctor") {
        user = await doctorModel
          .findById(Types.ObjectId(decoded.id))
          .select("-password");
      } else if (decoded.role === "patient") {
        user = await patientModel
          .findById(Types.ObjectId(decoded.id))
          .select("-password");
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin"){
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

export const doctor = (req, res, next) => {
  if (req.user && req.user.role === "doctor"){
    next();
  } else {
    res.status(403).json({ message: "Not authorized as doctor" });
  }
};

export const patient = (req, res, next) => {
  if (req.user && req.user.role === "patient"){
    next();
  } else {
    res.status(403).json({ message: "Not authorized as patient" });
  }
};