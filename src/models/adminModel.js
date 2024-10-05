import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the Admin schema
const adminSchema = new mongoose.Schema(
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
      index: true,
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
      match: [/^\d{10}$/, "Please enter a valid phone number"],
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
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    avatar: {
      type: String,
      default: "https://vectorified.com/images/default-user-icon-33.jpg",
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "admin",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    }
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined; // Do not store confirmPassword in the database
  next();
});

// Method to compare password for login
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the Admin model
const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;
