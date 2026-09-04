const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['citizen', 'admin'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please tell us your name.'], trim: true, maxlength: 80 },
  email: {
    type: String,
    required: [true, 'Please enter your email address.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [EMAIL_PATTERN, 'That email address does not look valid.'],
  },
  password: {
    type: String,
    required: [true, 'Please choose a password.'],
    minlength: [8, 'Please use a password of at least 8 characters.'],
    select: false,
  },
  role: { type: String, enum: ROLES, default: 'citizen' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.checkPassword = function checkPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
