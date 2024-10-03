import express from 'express';
import { registerDoctor, loginDoctor, forgotPassword, resetPassword } from '../controllers/doctorController.js';
import { doctor, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerDoctor);

router.post('/login', loginDoctor);

router.post('/forgot-password', protect , doctor ,forgotPassword);

router.post('/reset-password', protect , doctor,  resetPassword);

export default router;
