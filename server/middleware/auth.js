const User = require('../models/User');
const { verifyToken } = require('../utils/token');

// Errors jsonwebtoken raises for a token that is malformed, expired or signed
// with the wrong key. Anything else is a real fault and must not be reported
// as a bad session.
const TOKEN_ERRORS = ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'];

function isTokenError(err) {
  return TOKEN_ERRORS.includes(err.name);
}

function readBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice(7).trim();
}

// Resolves the token to a live user record. The role is read from the database
// rather than the token so a demoted account loses access immediately instead of
// keeping it until the token expires.
async function resolveUser(token) {
  const payload = verifyToken(token);
  return User.findById(payload.sub);
}

async function protect(req, res, next) {
  const token = readBearerToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }

  try {
    const user = await resolveUser(token);

    if (!user) {
      return res.status(401).json({ error: 'That account no longer exists. Please sign in again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (!isTokenError(err)) return next(err);

    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

// Attaches req.user when a valid token is present, but lets anonymous requests
// through untouched. Used by public routes that behave differently when signed in.
async function optionalAuth(req, res, next) {
  const token = readBearerToken(req);

  if (!token) return next();

  try {
    const user = await resolveUser(token);
    if (user) req.user = user;
  } catch (err) {
    // An invalid or expired token is treated as anonymous on public routes,
    // but a genuine fault should still surface rather than be swallowed.
    if (!isTokenError(err)) return next(err);
  }

  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'This action is limited to municipal staff accounts.' });
  }

  next();
}

module.exports = { protect, optionalAuth, requireAdmin };
