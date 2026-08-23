const express = require('express');
const router = express.Router();
const { register, login, getMe, getAvailableOfficerCodes } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/officer-codes', getAvailableOfficerCodes);

module.exports = router;
