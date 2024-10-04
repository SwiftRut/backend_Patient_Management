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
  claim_amount : {
    type : Number,
    min : [0]
  },
  claimed_amount : {
    type : Number,
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
  }
}, { timestamps: true });

const insuranceModel = mongoose.model("Insurance", insuranceSchema);

export default insuranceModel;
