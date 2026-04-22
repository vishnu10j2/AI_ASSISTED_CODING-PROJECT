const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ resident: req.session.userId }).populate('room').sort({ createdAt: -1 });
    res.render('resident/bookings', { title: 'My Bookings', bookings });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error fetching bookings.' };
    res.redirect('/dashboard');
  }
};

exports.getBookRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room || room.status !== 'Available') {
      req.session.flash = { type: 'danger', message: 'Room not available.' };
      return res.redirect('/resident/rooms');
    }
    res.render('resident/booking-form', { title: 'Book Room', room });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error loading booking form.' };
    res.redirect('/resident/rooms');
  }
};

exports.postBookRoom = async (req, res) => {
  try {
    const { checkIn, checkOut, note } = req.body;
    const room = await Room.findById(req.params.roomId);
    if (!room || room.status !== 'Available') {
      req.session.flash = { type: 'danger', message: 'Room not available.' };
      return res.redirect('/resident/rooms');
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      req.session.flash = { type: 'danger', message: 'Check-out must be after check-in.' };
      return res.redirect(`/resident/rooms/${req.params.roomId}/book`);
    }
    const existingPending = await Booking.findOne({ resident: req.session.userId, status: 'Pending' });
    if (existingPending) {
      req.session.flash = { type: 'warning', message: 'You already have a pending booking request.' };
      return res.redirect('/resident/bookings');
    }
    await Booking.create({ resident: req.session.userId, room: req.params.roomId, checkIn, checkOut, note });
    req.session.flash = { type: 'success', message: 'Booking request submitted successfully!' };
    res.redirect('/resident/bookings');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error submitting booking.' };
    res.redirect('/resident/rooms');
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('resident', 'name email').populate('room', 'roomNumber type').sort({ createdAt: -1 });
    res.render('admin/bookings', { title: 'All Bookings', bookings });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error fetching bookings.' };
    res.redirect('/dashboard');
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) { req.session.flash = { type: 'danger', message: 'Booking not found.' }; return res.redirect('/admin/bookings'); }
    booking.status = status;
    booking.adminNote = adminNote;
    await booking.save();
    if (status === 'Approved') {
      await Room.findByIdAndUpdate(booking.room._id, { status: 'Occupied' });
    } else if (status === 'Rejected') {
      await Room.findByIdAndUpdate(booking.room._id, { status: 'Available' });
    }
    req.session.flash = { type: 'success', message: `Booking ${status.toLowerCase()} successfully.` };
    res.redirect('/admin/bookings');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error updating booking.' };
    res.redirect('/admin/bookings');
  }
};
