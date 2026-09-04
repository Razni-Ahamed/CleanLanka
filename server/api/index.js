// Vercel serverless entry point. Vercel auto-detects files under api/ as
// functions, and vercel.json rewrites every path here so Express does the
// routing itself.
require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({ error: 'Could not reach the database. Please try again.' })
    );
  }

  return app(req, res);
};
