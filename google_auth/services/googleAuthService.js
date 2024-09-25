require('dotenv').config(); // Load environment variables
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload(); // Contains user information
    return payload;
  } catch (error) {
    throw new Error('Invalid Google ID Token');
  }
}

module.exports = { verifyToken };