import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";

// create appoinment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentTime } = req.body;

    const patient = await patientModel.findById(req.user._id);

    const conflictingAppointment = await appointmentModel.findOne({
      patientId: req.user.id,
      doctorId,
      appointmentdate,
      appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (conflictingAppointment) {
      return res
        .status(400)
        .json({ message: "Doctor is not available at this time" });
    }

    // If available, create a new appointment
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    patient.appointmenttId.push(newAppointment._id);
    await patient.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      data: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// all appoinment
export const AllAppointment = async (req, res) => {
  try {
    let data = await appointmentModel
      .find({
        PatientID: req.body.PatientID,
      })
      .populate("patientId doctorId hospitalId");
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// update appointment
export const UpdateAppointment = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await appointmentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ message: "update succesfully", data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// delete appointment
export const DeleteAppointment = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await appointmentModel.findByIdAndDelete(id);
    res.json({ message: "Delete succesfully", data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// fetch appointment for patient selected user
export const getPatientAppointmentHistory = async (req, res) => {
  try {
    const { PatientID } = req.params;

    const appointmentHistory = await appointmentModel
      .find({ PatientID })
      .populate("DoctorID", "DoctorName specialtiyType")
      .sort({ appointmentdate: -1 });

    res.status(200).json({
      message: "Patient appointment history",
      data: appointmentHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch appoinment for doctor
export const getDoctorAppointmentHistory = async (req, res) => {
  try {
    const { DoctorID } = req.params;

    const appointmentHistory = await appointmentModel
      .find({ DoctorID })
      .populate("PatientID", "firstname lastname") // Populates patient information
      .sort({ appointmentdate: -1 });
    console.log(appointmentHistory);

    res.status(200).json({
      message: "Doctor appointment history",
      data: appointmentHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// single appoinment
export const SingleAppoiment = async (req, res) => {
  try {
    let { id } = req.params;
    const SingleAppoiment = await AppointmentModel.findById(id)
      .populate({
        path: "patientId",
        select: "firstname lastname phonenumber gender age address",
      })
      .populate({ path: "doctorId", select: "DoctorName" })
      .populate({ path: "hospitalId" })
      .populate({ path: "insuranceId" });
    res.json(SingleAppoiment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// all patint for doctor
export const allpatient = async (req, res) => {
  try {
    let data = await patientModel.find();
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// doctor click patient record
export const singlepatient = async (req, res) => {
  try {
    let { id } = req.params;

    let patient = await patientModel.findById(id).populate("appointmentId");
    res.status(200).json({ data: patient });
  } catch (error) {
    req.status(400).json({ error: error.message });
  }
};
