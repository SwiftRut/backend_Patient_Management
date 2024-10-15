import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type:  Number,
      unique: true,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    patientName: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
      min: [0, "Age must be a positive number"],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    paymentType: {
      type: String,
      required: false,
      enum: ["Online", "Cash", "Insurance"],
    },
    date: {
      type: Date,
      required: false,
      default: Date.now,
    },
    time: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    amount: {
      type: Number,
      required: [false, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    discount: {
      type: Number,
      required: false,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    tax: {
      type: Number,
      required: [false, "Tax is required"],
      min: [0, "Tax cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
      required: false,
    },
    status: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [false, "Gender is required"],
    },
    diseaseName: {
      type: String,
      trim: false,
    },
    address: {
      type: String,
      required: [false, "Address is required"],
      trim: false,
    },
  },
  {
    timestamps: true,
  }
);

billSchema.plugin(AutoIncrement, {
  inc_field: "billNumber",
  start_seq: 1000,
});

// billSchema.virtual("totalAmount").get(function () {
//   return (
//     this.amount -
//     this.amount * (this.discount / 100) +
//     this.amount * (this.tax / 100)
//   );
// });

billSchema.set("toJSON", { virtuals: true });

const billModel = mongoose.model("Bill", billSchema);

export default billModel;
