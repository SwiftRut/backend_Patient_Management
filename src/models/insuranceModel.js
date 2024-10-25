import mongoose from "mongoose";

// Create the Insurance Schema
const insuranceSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    insuranceCompany: {
      type: String,
      // required: true,
      // enum: [
      //   "HDFC Life Insurance",
      //   "LIC Life Insurance",
      //   "Aegon Life Insurance",
      // ],
      trim: true,
    },
    insurancePlan: {
      type: String,
      // required: true,
      // enum: ["Maternity", "Medical", "Health"],
      // trim: true,
    },
    claimAmount: {
      type: Number,
      min: [0],
    },
    claimedAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const insuranceModel = mongoose.model("Insurance", insuranceSchema);

export default insuranceModel;
