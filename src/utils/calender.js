import { google } from 'googleapis';
import { oAuth2Client } from '../middlewares/googleAuth.js';

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

/**
 * Create a new time slot on Google Calendar for the doctor
 */
export async function createTimeSlot(doctorId, startTime, endTime) {
  const event = {
    summary: `Available Slot for Doctor`,
    description: `Doctor is available for appointments`,
    start: { dateTime: startTime, timeZone: 'Your/Timezone' },
    end: { dateTime: endTime, timeZone: 'Your/Timezone' },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating time slot:", error);
    throw error;
  }
}

/**
 * List all time slots and appointments from Google Calendar
 */
export async function listTimeSlots(doctorId, timeMin, timeMax) {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
}

/**
 * Update a time slot
 */
export async function updateTimeSlot(eventId, updates) {
  try {
    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      resource: updates,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating slot:", error);
    throw error;
  }
}

/**
 * Delete a time slot
 */
export async function deleteTimeSlot(eventId) {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  } catch (error) {
    console.error("Error deleting slot:", error);
    throw error;
  }
}
