const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

// Called before the server accepts traffic. Without this a missing JWT_SECRET
// surfaces as a 401 on every protected request, which reads like broken login
// rather than missing configuration.
function assertRequiredEnv() {
  const missing = REQUIRED.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. ` +
        'See server/.env.example, and set these in your Vercel project settings when deploying.'
    );
  }
}

module.exports = { assertRequiredEnv };
