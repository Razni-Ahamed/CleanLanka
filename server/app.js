require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reportsRouter = require('./routes/reports');
const authRouter = require('./routes/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Auth travels in the Authorization header, not a cookie, so no credentials are
// needed here. Set CLIENT_ORIGIN (comma-separated) in production to limit which
// sites may call the API; unset means allow any origin, which keeps local dev easy.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
