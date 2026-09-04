const jwt = require('jsonwebtoken');

const DEFAULT_EXPIRES_IN = '7d';

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET is not set. Copy server/.env.example to server/.env and add a long random string.'
    );
  }

  return secret;
}

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = { signToken, verifyToken };
