const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  location: { type: String, required: true },
  wasteType: { type: String, required: true },
  description: { type: String, required: true, maxlength: 300 },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'in-progress', 'collected'], default: 'pending' },
  reportedBy: { type: String, default: 'Anonymous' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
