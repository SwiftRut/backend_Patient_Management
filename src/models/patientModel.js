import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [false, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [false, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [false, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [false, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
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
    phone: {
      type: String,
      unique: true,
      required: [false, "Phone number is required"],
      match: [/^\d{10}$/, "Please provide a valid phone number"],
    },
    country: {
      type: String,
      required: [false, "Country is required"],
    },
    state: {
      type: String,
      required: [false, "State is required"],
    },
    city: {
      type: String,
      required: [false, "City is required"],
    },
    address: {
      type: String,
      required: [false, "Address is required"],
      trim: false,   
    },
    diseaseName: {
      type: String,
      trim: false,
    },
    role: {
      type: String,
      default: "patient",
    },
    avatar: {
      type: String,
      default: "https://vectorified.com/images/default-user-icon-33.jpg",
    },
    appointmentId : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "Appointment"
    }],
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    age: {
      type: Number,
      required: [false, "Age is required"],
      min: [0, "Age must be a positive number"],
    },
    height: {
      type: Number, // height in centimeters
      required: [false, "Height is required"],
      min: [0, "Height must be a positive number"],
    },
    weight: {
      type: Number, // weight in kilograms
      required: [false, "Weight is required"],
      min: [0, "Weight must be a positive number"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [false, "Gender is required"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [false, "Blood group is required"],
    },
    dob: {
      type: Date,
      required: [false, "Date of birth is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    insurance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
    },
    role: {
      type: String,
      default: "patient",
    },

    deviceToken: {
      type: String,
      required: false,
      default: "null"
    },
  },
  { timestamps: true }
);

// Hash password before saving
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.confirmPassword = undefined; // We won't store confirmPassword in the database
  next();
});

const patientModel = mongoose.model("Patient", patientSchema);

export default patientModel;
