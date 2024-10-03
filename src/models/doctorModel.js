// models/Doctor.js

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    speciality: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
        type: String,
        default: "https://vectorified.com/images/default-user-icon-33.jpg",
      },
    workingTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    breakTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    patientCheckoutTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);

export default doctorModel;
