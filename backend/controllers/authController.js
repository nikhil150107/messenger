const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterUser = async (req, res) => {
    console.log("Register route hit!", req.body);
    try {
        const {
            name,
            gender,
            mob_no,
            email,
            password,
            confirmPassword,
            country_id,
            state_id,
            city_id
        } = req.body;

        if (!name || !gender || !mob_no || !email || !password || !confirmPassword || !country_id || !state_id || !city_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        const existingUser = await User.findByEmailOrMobile(email, mob_no);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email or Mobile Number already registered, Try something new!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUserId = await User.create({
            name,
            password: hashPassword,
            email,
            gender,
            country_id,
            state_id,
            city_id,
            mob_no
        });

        if (newUserId) {
            res.status(201).json({
                success: true,
                message: "User created successfully!"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Unable to register User, please try again"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occur,please try again"
        });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email,please try again"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password,please try again"
            });
        }

        const accessToken = jwt.sign({
            userId: user.user_id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });
        res.status(200).json({
            success: true,
            message: "Login Successfully!",
            accessToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occur,please try again"
        });
    }
};

module.exports = { RegisterUser, LoginUser };