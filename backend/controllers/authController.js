const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateOtp, getOtpExpiry } = require('../services/otpService');
const { sendOtpEmail } = require('../services/emailService');

const RegisterUser = async (req, res) => {
    try {
        const { name, gender, mob_no, email, password, confirmPassword, country_id, state_id, city_id } = req.body;

        if (!name || !gender || !mob_no || !email || !password || !confirmPassword || !country_id || !state_id || !city_id) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password and Confirm Password do not match" });
        }

        const existingUser = await User.findByEmailOrMobile(email, mob_no);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Mobile Number already registered!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const otp = generateOtp();
        const otpExpiry = getOtpExpiry();

        // country_id, state_id, city_id are ISO codes/names from country-state-city library
        // store them as text directly — no DB lookup needed
        const newUserId = await User.create({
            name,
            password: hashPassword,
            email,
            gender,
            country_name: country_id,
            state_name: state_id,
            city_name: city_id,
            mob_no,
            otp,
            otp_expiry: otpExpiry
        });

        if (!newUserId) {
            return res.status(400).json({ success: false, message: "Unable to register user, please try again" });
        }

        // Send OTP email — non-blocking so DB insert is not rolled back on email failure
        sendOtpEmail(email, otp).catch(err => console.error('Email send failed:', err.message));

        res.status(201).json({ success: true, message: "Registration successful! Please verify your email.", userId: newUserId });

    } catch (error) {
        console.error('REGISTER ERROR:', error.message, error.stack);
        res.status(500).json({ success: false, message: error.message || "Server error, please try again" });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        if (!user.is_verified) {
            return res.status(400).json({ success: false, message: "Please verify your email before logging in" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { userId: user.user_id, name: user.name, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '30m' }
        );

        res.status(200).json({ success: true, message: "Login successful!", accessToken, name: user.name });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error, please try again" });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ success: false, message: "User ID and OTP are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.is_verified) {
            return res.status(400).json({ success: false, message: "User is already verified" });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(410).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }

        await User.markVerified(user.email);

        res.status(200).json({ success: true, message: "Email verified successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error, please try again" });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.is_verified) {
            return res.status(400).json({ success: false, message: "User is already verified" });
        }

        const otp = generateOtp();
        const otpExpiry = getOtpExpiry();

        await User.updateOtp(user.email, otp, otpExpiry);
        sendOtpEmail(user.email, otp).catch(err => console.error('Email send failed:', err.message));

        res.status(200).json({ success: true, message: "OTP resent successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error, please try again" });
    }
};

module.exports = { RegisterUser, LoginUser, verifyOtp, resendOtp };
