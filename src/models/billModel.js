import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["online", "cash", "insurance"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([0-9]{1,2}):([0-9]{2})$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
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
      required: [true, "Tax is required"],
      min: [0, "Tax cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: true,
      set: function () {
        return (
          this.amount -
          this.amount * (this.discount / 100) +
          this.amount * (this.tax / 100)
        );
      },
    },
    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
      required: false,
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

billSchema.virtual("totalAmount").get(function () {
  return (
    this.amount -
    this.amount * (this.discount / 100) +
    this.amount * (this.tax / 100)
  );
});

billSchema.set("toJSON", { virtuals: true });

const billModel = mongoose.model("Bill", billSchema);

export default billModel;
