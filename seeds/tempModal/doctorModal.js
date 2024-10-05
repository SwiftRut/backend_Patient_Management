import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema({
  name: { type: String },
  gender: { type: String },
  qualification: { type: String },
  speciality: { type: String },
  avatar: { type: String },
  workingTime: { type: String },
  breakTime: { type: String },
  patientCheckupTime: { type: String },
  workingOn: { type: String },
  experience: { type: Number },
  phone: { type: String },
  age: { type: Number },
  email: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  zipCode: { type: String },
  doctorAddress: { type: String },
  description: { type: String },
  onlineConsultationRate: { type: Number },
  currentHospital: { type: String },
  hospitalName: { type: String },
  hospitalAddress: { type: String },
  worksiteLink: { type: String },
  emergencyContactNo: { type: String },
  signatureUpload: { type: String },
}, {
  timestamps: true,
});

const doctorModel = mongoose.model("Doctor", doctorSchema);

export default doctorModel;

