const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middleware/auth');

router.get('/login', isGuest, authController.getLogin);
router.post('/login', isGuest, authController.postLogin);
router.get('/signup', isGuest, authController.getSignup);
router.post('/signup', isGuest, authController.postSignup);
router.get('/logout', authController.logout);

module.exports = router;
