import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    zipcode: {
      type: String,
      required: [true, "Zip code is required"],
      match: [/^\d{5}(-\d{4})?$/, "Please provide a valid zip code"],
    },
  },
  {
    timestamps: true,
  }
);

const hospitalModel = mongoose.model("Hospital", hospitalSchema);
export default hospitalModel;
