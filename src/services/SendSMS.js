import "dotenv/config"; // Load .env variables
import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
      to: to, // Recipient's phone number
    });
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};

export { sendSMS };
