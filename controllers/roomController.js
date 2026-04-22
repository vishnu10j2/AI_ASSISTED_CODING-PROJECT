const Room = require('../models/Room');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.render('admin/rooms', { title: 'Room Management', rooms });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error fetching rooms.' };
    res.redirect('/dashboard');
  }
};

exports.getAddRoom = (req, res) => {
  res.render('admin/room-form', { title: 'Add Room', room: null });
};

exports.postAddRoom = async (req, res) => {
  try {
    const { roomNumber, type, capacity, price, floor, amenities, status, description } = req.body;
    const amenitiesArr = amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [];
    await Room.create({ roomNumber, type, capacity, price, floor, amenities: amenitiesArr, status, description });
    req.session.flash = { type: 'success', message: 'Room added successfully.' };
    res.redirect('/admin/rooms');
  } catch (err) {
    if (err.code === 11000) req.session.flash = { type: 'danger', message: 'Room number already exists.' };
    else req.session.flash = { type: 'danger', message: 'Error adding room.' };
    res.redirect('/admin/rooms/add');
  }
};

exports.getEditRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) { req.session.flash = { type: 'danger', message: 'Room not found.' }; return res.redirect('/admin/rooms'); }
    res.render('admin/room-form', { title: 'Edit Room', room });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error loading room.' };
    res.redirect('/admin/rooms');
  }
};

exports.postEditRoom = async (req, res) => {
  try {
    const { roomNumber, type, capacity, price, floor, amenities, status, description } = req.body;
    const amenitiesArr = amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [];
    await Room.findByIdAndUpdate(req.params.id, { roomNumber, type, capacity, price, floor, amenities: amenitiesArr, status, description });
    req.session.flash = { type: 'success', message: 'Room updated successfully.' };
    res.redirect('/admin/rooms');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error updating room.' };
    res.redirect(`/admin/rooms/${req.params.id}/edit`);
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    req.session.flash = { type: 'success', message: 'Room deleted successfully.' };
    res.redirect('/admin/rooms');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error deleting room.' };
    res.redirect('/admin/rooms');
  }
};

exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'Available' }).sort({ price: 1 });
    res.render('resident/rooms', { title: 'Available Rooms', rooms });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error fetching rooms.' };
    res.redirect('/dashboard');
  }
};
