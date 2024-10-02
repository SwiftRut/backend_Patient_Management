import Patient from '../models/patientModel.js';
import Hospital from '../models/hospitalModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//register patient
export const registerPatient = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            phone,
            country,
            state,
            city,
            hospital
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !country || !state || !city || !hospital) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const hospitalExists = await Hospital.findById(hospital);
        if (!hospitalExists) {
            return res.status(400).json({ message: 'Invalid hospital selected' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newPatient = new Patient({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            country,
            state,
            city,
            hospital
        });

        await newPatient.save();
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//login patient
export const loginPatient = async (req, res) => {
    try {
        const { identifier, password, rememberMe } = req.body; // Identifier can be email or phone

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide email/phone and password' });
        }

        // Check if user exists by email or phone
        const patient = await Patient.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!patient) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: patient._id },
            process.env.JWT_SECRET, 
            { expiresIn: rememberMe ? '7d' : '1d' } // 'Remember Me' for 7 days, otherwise 1 day
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            patient: {
                id: patient._id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                phone: patient.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};