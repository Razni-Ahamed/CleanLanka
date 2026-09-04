const express = require('express');
const User = require('../models/User');
const { signToken } = require('../utils/token');
const { protect } = require('../middleware/auth');

const router = express.Router();

const MIN_PASSWORD_LENGTH = 8;

router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName) {
    errors.push('Please tell us your name.');
  }

  const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!trimmedEmail) {
    errors.push('Please enter your email address.');
  }

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Please use a password of at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  try {
    // Role is never taken from the request body — self-registration always
    // creates a citizen account. Admins are created by the seed script.
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    res.status(201).json({ token: signToken(user), user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!trimmedEmail || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Please enter your email and password.' });
  }

  try {
    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    // The same message covers both an unknown email and a wrong password so the
    // response cannot be used to discover which addresses have accounts.
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'That email or password is not correct.' });
    }

    res.json({ token: signToken(user), user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

module.exports = router;
