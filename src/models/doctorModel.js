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
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    qualification: {
      type: String,
      trim: true,
    },
    speciality: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://vectorified.com/images/default-user-icon-33.jpg",
    },
    workingTime: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    breakTime: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    patientCheckupTime: {
      type: String,
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
    },
    experience: {
      type: Number,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    age: {
      type: Number,
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
    },
    doctorAddress: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    onlineConsultationRate: {
      type: Number,
      min: [0, "Rate must be a positive number"],
    },
    currentHospital: {
      type: String,
      trim: true,
    },
    hospitalName: {
      type: String,
      trim: true,
    },
    hospitalAddress: {
      type: String,
      trim: true,
    },
    worksiteLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+$/, "Please provide a valid URL"], // URL validation
    },
    emergencyContactNo: {
      type: String,
      match: [
        /^\d{10}$/,
        "Please provide a valid 10-digit emergency contact number",
      ],
    },
    signatureUpload: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);

export default doctorModel;
