const mongoose = require('mongoose');

// On Vercel the backend runs as a serverless function, so this module is
// re-evaluated on every cold start. Caching the connection on globalThis keeps
// one connection per container instead of opening a new one per request, which
// would quickly exhaust the Atlas free-tier connection limit.
let cached = globalThis._mongoose;

if (!cached) {
  cached = globalThis._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      'MONGO_URI is not set. Copy server/.env.example to server/.env and add your Atlas connection string.'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Don't cache a failed attempt, or every later request reuses the failure.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;
