const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterUser = async (req, res) => {
    console.log("Register route hit!", req.body);
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findByUsernameOrEmail(username, email);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Same Username or email exist,Try something new!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUserId = await User.create({ username, email, password: hashPassword });

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
        const { username, password } = req.body;

        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Username,please try again"
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
            userId: user.id,
            username: user.username,
            role: user.role
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