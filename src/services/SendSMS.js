require('dotenv').config(); // Load .env variables
const twilio = require('twilio');

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
        console.log(`Message sent: ${response.sid}`);
        return response;
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        throw error;
    }
};

module.exports = { sendSMS };
