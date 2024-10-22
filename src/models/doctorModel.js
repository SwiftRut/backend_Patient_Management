import mongoose from "mongoose";
import bcrypt from "bcrypt";
const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital ID is required"],
    },
    name:{
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      enum: ["Male", "Female", "Other"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
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
    qualification: {
      type: String,
      required: false,
      trim: true,
    },
    speciality: {
      type: String,
      required: false,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://vectorified.com/images/default-user-icon-33.jpg",
    },
    workingTime: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    breakTime: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v); // Validates time format (HH:mm)
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    patientCheckupTime: {
      type: String,
      required: false,
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
      required: false, // Selection box for employment type
    },
    experience: {
      type: Number,
      required: [false, "Experience is required"],
    },
    phone: {
      type: String,
      required: [false, "Phone number is required"],
    },
    age: {
      type: Number,
      required: false,
      min: [0, "Age must be a positive number"],
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    country: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },

    zipCode: {
      type: String,
      required: false,
    },
    doctorAddress: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    onlineConsultationRate: {
      type: Number,
      required: [false, "Online consultation rate is required"],
      min: [0, "Rate must be a positive number"],
    },
    currentHospital: {
      type: String,
      required: false,
      trim: true,
    },
    hospitalName: {
      type: String,
      required: false,
      trim: true,
    },
    hospitalAddress: {
      type: String,
      required: false,
      trim: true,
    },
    worksiteLink: {
      type: String,
      required: false,
      trim: true,
      match: [/^https?:\/\/.+$/, "Please provide a valid URL"], // URL validation
    },
    emergencyContactNo: {
      type: String,
      required: false,
      match: [
        /^\d{10}$/,
        "Please provide a valid 10-digit emergency contact number",
      ],
    },
    signature: {
      type: String,
      required: false,
    },
    hospitalName: {
      type: String,
      required: false,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);
// Password hashing middleware
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined; // Do not store confirmPassword in the database
  next();
});
// Method to compare password for login
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const doctorModel = mongoose.model("Doctor", doctorSchema);

export default doctorModel;
