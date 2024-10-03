import mongoose from "mongoose";
import bcrypt from "bcrypt";

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
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
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Please provide a valid phone number"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    adress: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    diseaseName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "patient",
    },
    avatar: {
      type: String,
      default: "https://vectorified.com/images/default-user-icon-33.jpg",
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age must be a positive number"],
    },
    height: {
      type: Number, // height in centimeters
      required: [true, "Height is required"],
      min: [0, "Height must be a positive number"],
    },
    weight: {
      type: Number, // weight in kilograms
      required: [true, "Weight is required"],
      min: [0, "Weight must be a positive number"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "Blood group is required"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
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
