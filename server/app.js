require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reportsRouter = require('./routes/reports');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/reports', reportsRouter);

// Must stay last, and in this order.
app.use(notFound);
app.use(errorHandler);

// Exported without calling listen, so the same app serves both the local dev
// server (server.js) and the Vercel serverless function (api/index.js).
module.exports = app;
