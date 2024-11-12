import express from 'express';
const router = express.Router();
import { createMessage, getChatHistory, updateMessageStatus, deleteMessage, getDoctorContacts, getPatientContacts } from '../controllers/chatController.js';

// CRUD operations for chat messages
router.post('/', createMessage);
router.get('/:doctorId/:patientId',getChatHistory);
router.put('/:chatId', updateMessageStatus);
router.delete('/:chatId', deleteMessage);

// Endpoints to retrieve contacts list
router.get('/contacts/patient/:patientId', getDoctorContacts);
router.get('/contacts/doctor/:doctorId', getPatientContacts);
export default router;
