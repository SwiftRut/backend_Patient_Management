import express from 'express';
import { registerAdmin, loginAdmin, forgotPassword, resetPassword } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdmin);

router.post('/login', loginAdmin);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

export default router;
