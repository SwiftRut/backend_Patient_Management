import { CACHE_TIMEOUT } from "../constants.js";
import Chat from "../models/chatModel.js";
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";
import { client } from "../redis.js";
const invalidateCache = async (id) => {
  const CACHE_KEYS = {
    GET_DOCTOR_BY_ID: `/doctor/getDoctorById/${id}`,
    GET_DOCTOR_APPOINTMENT_HISTORY: `/appointment/getDoctorAppointmentHistory/${id}`,
  };

  const keysToDelete = Object.values(CACHE_KEYS); // Extract all keys to delete

  for (const key of keysToDelete) {
    await client.del(key); // Delete each key from the cache
  }

  console.log(`Cache invalidated for keys: ${keysToDelete.join(", ")}`);
};

// Create a new message
const createMessage = async (req, res) => {
  const { senderId, receiverId, messageContent } = req.body;
  try {
    const chat = new Chat({ senderId, receiverId, messageContent });
    invalidateCache(senderId);
    invalidateCache(receiverId);
    await client.del(`/chat/${senderId}/${receiverId}`);
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve chat history between a doctor and patient
const getChatHistory = async (req, res) => {
  const { doctorId, patientId } = req.params;
  try {
    const history = await Chat.find({ doctorId, patientId }).sort({
      timestamp: 1,
    });

    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(history));
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a message's status
const updateMessageStatus = async (req, res) => {
  const { chatId } = req.params;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { status: "read" },
      { new: true }
    );
    const chat = new Chat({ senderId, receiverId, messageContent });
    invalidateCache(senderId);
    invalidateCache(receiverId);
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a message
const deleteMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    await Chat.findByIdAndDelete(chatId);
    const chat = new Chat({ senderId, receiverId, messageContent });
    invalidateCache(senderId);
    invalidateCache(receiverId);
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve list of doctors a patient has chatted with
const getDoctorContacts = async (req, res) => {
  const { patientId } = req.params;
  try {
    const doctorIds = await Chat.find({ patientId }).distinct("doctorId");
    const doctorContacts = await doctorModel
      .find({
        _id: { $in: doctorIds },
      })
      .select("-password");

    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(doctorContacts));
    res.status(200).json(doctorContacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientContacts = async (req, res) => {
  const { doctorId } = req.params;
  try {
    // Step 1: Get distinct patient IDs
    const patientIds = await Chat.find({ doctorId }).distinct("patientId");

    // Step 2: Populate the patient details using the IDs
    const populatedPatients = await patientModel.find({
      _id: { $in: patientIds },
    });
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(populatedPatients));
    res.status(200).json(populatedPatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createMessage,
  getChatHistory,
  updateMessageStatus,
  deleteMessage,
  getDoctorContacts,
  getPatientContacts,
};
