const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');
const complaintController = require('../controllers/complaintController');
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

// Rooms
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/add', roomController.getAddRoom);
router.post('/rooms/add', roomController.postAddRoom);
router.get('/rooms/:id/edit', roomController.getEditRoom);
router.post('/rooms/:id/edit', roomController.postEditRoom);
router.post('/rooms/:id/delete', roomController.deleteRoom);

// Bookings
router.get('/bookings', bookingController.getAllBookings);
router.post('/bookings/:id/status', bookingController.updateBookingStatus);

// Complaints
router.get('/complaints', complaintController.getAllComplaints);
router.post('/complaints/:id/update', complaintController.updateComplaint);

// Users
router.get('/users', userController.getAllUsers);
router.post('/users/:id/delete', userController.deleteUser);

module.exports = router;
