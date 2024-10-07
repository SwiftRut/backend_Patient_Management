import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    confirmPassword: String,
    phone: String,
    country: String,
    state: String,
    city: String,
    adress: String,
    diseaseName: String,
    role: String,
    avatar: String,
    resetPasswordOtp: String,
    resetPasswordExpires: Date,
    age: Number,
    height: Number,
    weight: Number,
    gender: String,
    bloodGroup: String,
    dob: Date,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  { timestamps: true }
);

const patientModel = mongoose.model("Patient", patientSchema);

export default patientModel;

