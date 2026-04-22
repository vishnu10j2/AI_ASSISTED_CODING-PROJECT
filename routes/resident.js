const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');
const complaintController = require('../controllers/complaintController');
const { isAuthenticated, isResident } = require('../middleware/auth');

router.use(isAuthenticated, isResident);

// Rooms
router.get('/rooms', roomController.getAvailableRooms);
router.get('/rooms/:roomId/book', bookingController.getBookRoom);
router.post('/rooms/:roomId/book', bookingController.postBookRoom);

// Bookings
router.get('/bookings', bookingController.getMyBookings);

// Complaints
router.get('/complaints', complaintController.getMyComplaints);
router.get('/complaints/new', complaintController.getNewComplaint);
router.post('/complaints/new', complaintController.postNewComplaint);

module.exports = router;
