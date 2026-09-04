require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/db');
const { assertRequiredEnv } = require('../config/env');

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  try {
    assertRequiredEnv();
  } catch (err) {
    // Logged in full so the cause is visible in the Vercel function logs; the
    // response stays vague so configuration details are not exposed publicly.
    console.error('Configuration error:', err.message);
    return sendJson(res, 500, { error: 'The server is not configured correctly.' });
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed:', err);
    return sendJson(res, 500, {
      error: 'Could not reach the database. Please try again.',
    });
  }

  return app(req, res);
};
