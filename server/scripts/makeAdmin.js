require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

// Creates or promotes a single admin without touching anything else, which is
// what production needs — `npm run seed` clears both collections and is only
// safe on an empty database.
//
//   npm run make-admin -- someone@council.lk
//   npm run make-admin -- someone@council.lk "their password" "Their Name"

const MIN_PASSWORD_LENGTH = 8;

async function makeAdmin() {
  const [emailArg, passwordArg, nameArg] = process.argv.slice(2);
  const email = typeof emailArg === 'string' ? emailArg.trim().toLowerCase() : '';

  if (!email) {
    console.error('Usage: npm run make-admin -- <email> [password] [name]');
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role === 'admin') {
        console.log(`${email} is already an admin. Nothing to do.`);
        return;
      }

      existing.role = 'admin';
      await existing.save();
      console.log(`Promoted ${email} to admin.`);
      return;
    }

    if (!passwordArg || passwordArg.length < MIN_PASSWORD_LENGTH) {
      console.error(
        `No account exists for ${email}. To create one, pass a password of at ` +
          `least ${MIN_PASSWORD_LENGTH} characters:\n` +
          '  npm run make-admin -- <email> <password> [name]'
      );
      process.exitCode = 1;
      return;
    }

    // Saved through the model so the password-hashing hook runs.
    await User.create({
      name: nameArg || 'Municipal Admin',
      email,
      password: passwordArg,
      role: 'admin',
    });

    console.log(`Created admin account for ${email}.`);
  } catch (err) {
    console.error('Could not make that account an admin:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

makeAdmin();
