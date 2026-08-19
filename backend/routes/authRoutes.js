const express = require('express');
const { RegisterUser, LoginUser, verifyOtp, resendOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

module.exports = router;
