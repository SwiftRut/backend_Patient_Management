import medicalRecordModel from "../models/medicalRecord";
import prescriptionModel from "../models/prescriptionModel";

export const createmedicalrecord = async (req, res) => {
  try {
    let { type, date, description, attachments } = req.body;

    const data = await prescriptionModel
      .findById({ doctorId: req.user._id })
      .populate("patientId", "doctorId", "prescriptionId", "appointmentId");

    const medicalrecord = new medicalRecordModel({
      patientId: data.patientId,
      doctorId: req.user._id,
      prescriptionId: data._id,
      appointmentId: data.appointmentId,
      type,
      date,
      description,
      attachments,
    });

    const createmedicalrecord = await medicalrecord.save();
    res.status(200).json({ Medical: createmedicalrecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await medicalRecordModel
      .find()
      .populate("patientId doctorId prescriptionId appointmentId");
    res.status(200).json(medicalRecords);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMedicalRecordById = async (req, res) => {
  try {
    const medicalRecord = await medicalRecordModel
      .findById(req.params.id)
      .populate("patientId doctorId prescriptionId appointmentId");

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json(medicalRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMedicalRecord = async (req, res) => {
  const { type, date, description, attachments } = req.body;

  try {
    const medicalRecord = await medicalRecordModel.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    medicalRecord.type = type || medicalRecord.type;
    medicalRecord.date = date || medicalRecord.date;
    medicalRecord.description = description || medicalRecord.description;
    medicalRecord.attachments = attachments || medicalRecord.attachments;

    const updatedMedicalRecord = await medicalRecord.save();
    res.status(200).json(updatedMedicalRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    await medicalRecord.remove();
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
