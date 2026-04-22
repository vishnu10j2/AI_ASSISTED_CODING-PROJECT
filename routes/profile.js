const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', userController.getProfile);
router.post('/update', userController.updateProfile);
router.post('/change-password', userController.changePassword);

module.exports = router;
