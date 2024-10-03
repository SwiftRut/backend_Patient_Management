import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
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
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: [true, "Prescription ID is required"],
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    type: {
      type: String,
      enum: ["lab_result", "imaging", "clinical_note"],
      required: [true, "Medical record type is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        filename: {
          type: String,
          trim: true,
        },
        fileType: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const medicalRecordModel = mongoose.model("MedicalRecord", medicalRecordSchema);

export default medicalRecordModel;
