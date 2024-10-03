import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  hospitalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital' 
  },
  date: { 
    type: Date, 
    required: true 
  },
  appointmentTime: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  type: { 
    type: String, 
    enum: ['in-person', 'teleconsultation'], 
    required: true 
  },
  reason: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

const appointmentModel = mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;
