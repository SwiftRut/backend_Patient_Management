import express from 'express';
import { registerDoctor, loginDoctor, forgotPassword, resetPassword } from '../controllers/doctorController.js';

const router = express.Router();

router.post('/register', registerDoctor);

router.post('/login', loginDoctor);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

export default router;