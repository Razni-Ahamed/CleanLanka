require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { assertRequiredEnv } = require('./config/env');

const PORT = process.env.PORT || 5000;

try {
  assertRequiredEnv();
} catch (err) {
  console.error('Configuration error:', err.message);
  process.exit(1);
}

connectDB()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
