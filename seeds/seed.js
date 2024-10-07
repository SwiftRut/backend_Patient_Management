import mongoose from 'mongoose';
import dotenv from 'dotenv';
import doctorModel from './tempModal/doctorModal.js';
import patientModel from './tempModal/patientModal.js';
// import appointmentModel from './tempModal/appointmentModel.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await doctorModel.deleteMany();
        await patientModel.deleteMany();
        // await appointmentModel.deleteMany();

        const doctorData = await import('./data/doctors.json', {
            assert: { type: 'json' }
        }).then(module => module.default);
        
        const patientData = await import('./data/patients.json', {
            assert: { type: 'json' }
        }).then(module => module.default);
        
        // const appointmentData = await import('./data/appointments.json', {
        //     assert: { type: 'json' }
        // }).then(module => module.default);

        const doctorsInserted = await doctorModel.insertMany(doctorData).catch((error) => {
            console.error('Error inserting doctors:', error);
            return [];
        });

        const patientsInserted = await patientModel.insertMany(patientData).catch((error) => {
            console.error('Error inserting patients:', error);
            return [];
        });

        // const appointmentsInserted = await appointmentModel.insertMany(appointmentData).catch((error) => {
        //     console.error('Error inserting appointments:', error);
        //     return [];
        // });

        console.log('Data seeded successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

const runSeeder = async () => {
    await connectDB();
    await seedData();
};

runSeeder();
