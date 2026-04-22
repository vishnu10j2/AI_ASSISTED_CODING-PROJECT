const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['Single', 'Double', 'Triple', 'Dormitory'], required: true },
  capacity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  floor: { type: Number, required: true },
  amenities: [{ type: String }],
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
