import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment ID is required"],
    },
    medications: [
      {
        name: {
          type: String,
          required: [true, "Medication name is required"],
          trim: true,
        },
        dosage: {
          type: String,
          required: [true, "Dosage is required"],
          trim: true,
        },
        frequency: {
          type: String,
          required: [true, "Frequency is required"],
          trim: true,
        },
        duration: {
          type: String,
          required: [true, "Duration is required"],
          trim: true,
        },
      },
    ],
    instructions: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const prescriptionModel = mongoose.model("Prescription", prescriptionSchema);

export default prescriptionModel;
