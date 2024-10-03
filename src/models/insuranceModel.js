import mongoose from "mongoose";

// Create the Insurance Schema
const insuranceSchema = new mongoose.Schema({
  bill: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Bill",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Patient",
    required: true,
  },
  diseaseName: {
    type: String,
    required: [true, "Disease name is required"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be a positive number"],
  },
  insuranceCompany: {
    type: String,
    required: true,
    enum: [
      "HDFC Life Insurance",
      "LIC Life Insurance",
      "Aegon Life Insurance",
    ],
    trim: true,
  },
  insurancePlan: {
    type: String,
    required: true,
    enum: ["Maternity", "Medical", "Health"], 
    trim: true,
  },
  billDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { timestamps: true });

const insuranceModel = mongoose.model("Insurance", insuranceSchema);

export default insuranceModel;
