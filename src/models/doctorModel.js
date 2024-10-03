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
    patientCheckupTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    // Newly added fields
    workingOn: {
      type: String,
      enum: ["Part-time", "Full-time", "Contract"],
      required: true, // Selection box for employment type
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    },
    age: {
      type: Number,
      required: true,
      min: [0, "Age must be a positive number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    doctorAddress: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    onlineConsultationRate: {
      type: Number,
      required: [true, "Online consultation rate is required"],
      min: [0, "Rate must be a positive number"],
    },
    currentHospital: {
      type: String,
      required: true,
      trim: true,
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    hospitalAddress: {
      type: String,
      required: true,
      trim: true,
    },
    worksiteLink: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+$/, "Please provide a valid URL"], // URL validation
    },
    emergencyContactNo: {
      type: String,
      required: true,
      match: [
        /^\d{10}$/,
        "Please provide a valid 10-digit emergency contact number",
      ],
    },
    signatureUpload: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);

export default doctorModel;
