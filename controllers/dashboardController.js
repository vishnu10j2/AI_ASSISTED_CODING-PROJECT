const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');

exports.getDashboard = async (req, res) => {
  try {
    if (req.session.role === 'admin') {
      const [totalRooms, totalUsers, totalBookings, totalComplaints, pendingBookings, openComplaints] = await Promise.all([
        Room.countDocuments(),
        User.countDocuments({ role: 'resident' }),
        Booking.countDocuments(),
        Complaint.countDocuments(),
        Booking.countDocuments({ status: 'Pending' }),
        Complaint.countDocuments({ status: 'Open' }),
      ]);
      const recentBookings = await Booking.find().populate('resident', 'name').populate('room', 'roomNumber').sort({ createdAt: -1 }).limit(5);
      const recentComplaints = await Complaint.find().populate('resident', 'name').sort({ createdAt: -1 }).limit(5);
      return res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        totalRooms, totalUsers, totalBookings, totalComplaints,
        pendingBookings, openComplaints, recentBookings, recentComplaints
      });
    } else {
      const myBookings = await Booking.find({ resident: req.session.userId }).populate('room').sort({ createdAt: -1 }).limit(3);
      const myComplaints = await Complaint.find({ resident: req.session.userId }).sort({ createdAt: -1 }).limit(3);
      const approvedBooking = await Booking.findOne({ resident: req.session.userId, status: 'Approved' }).populate('room');
      return res.render('resident/dashboard', {
        title: 'My Dashboard',
        myBookings, myComplaints, approvedBooking
      });
    }
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error loading dashboard.' };
    res.redirect('/');
  }
};
