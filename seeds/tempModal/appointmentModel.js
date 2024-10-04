import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId },
    doctorId: { type: mongoose.Schema.Types.ObjectId },
    hospitalId: { type: mongoose.Schema.Types.ObjectId },
    date: { type: Date },
    appointmentTime: { type: String },
    status: { type: String },
    type: { type: String },
    reason: { type: String },
    notes: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;

