import { google } from 'googleapis';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const credentials = JSON.parse(fs.readFileSync('credentials.json'));

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Generate a URL for authorization
function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

// Get tokens and set credentials
async function getToken(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  // Store tokens securely (e.g., in a database or a secure file)
}

export { oAuth2Client, getAuthUrl, getToken };
