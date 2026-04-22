const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Maintenance', 'Noise', 'Cleanliness', 'Security', 'Other'], default: 'Other' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  adminResponse: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
