import { createTimeSlot, deleteTimeSlot, listTimeSlots, updateTimeSlot } from "../utils/calender.js";

export const createtimeslotfordoctor = async (req, res) => {
    const { doctorId, startTime, endTime } = req.body;

    try {
        const slot = await createTimeSlot(doctorId, startTime, endTime);
        res.json(slot);
    } catch (error) {
        res.status(500).send('Error creating time slot');
    }
}

export const doctoravilableslot = async(req , res) =>{
    const { doctorId } = req.params;
    const { timeMin, timeMax } = req.query;
  
    try {
      const slots = await listTimeSlots(doctorId, timeMin, timeMax);
      res.json(slots);
    } catch (error) {
      res.status(500).send('Error fetching time slots');
    }
}

export const updatetime = async(req , res) =>{
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const updatedSlot = await updateTimeSlot(id, updates);
      res.json(updatedSlot);
    } catch (error) {
      res.status(500).send('Error updating time slot');
    }
}

export const deletetime = async(req , res) =>{
    const { id } = req.params;

    try {
      await deleteTimeSlot(id);
      res.send('Time slot deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting time slot');
    }
}
