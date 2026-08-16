const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterUser = async (req, res) => {
    console.log("Register route hit!", req.body);
    try {
        let {
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

        // basic required fields check (allow strings for location inputs; will resolve below)
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

        // Resolve country/state/city inputs to integer IDs when necessary
        // If client already sent numeric IDs, keep them. If they sent codes/names, look them up.
        const pool = require('../config/db');

        // Resolve country
        if (typeof country_id !== 'number') {
            // Try several matching strategies: exact name, code, partial name, phonecode
            const [countryRows] = await pool.query(
                `SELECT country_id FROM country WHERE country_code = ? OR country_name = ? OR country_name LIKE ? LIMIT 1`,
                [country_id, country_id, `%${country_id}%`]
            );
            if (!countryRows || countryRows.length === 0) {
                // as a last resort, try case-insensitive match on name or code
                const [ciRows] = await pool.query(
                    `SELECT country_id FROM country WHERE LOWER(country_name) = LOWER(?) OR LOWER(country_code) = LOWER(?) LIMIT 1`,
                    [country_id, country_id]
                );
                if (!ciRows || ciRows.length === 0) {
                    return res.status(400).json({ success: false, message: 'Invalid country selection' });
                }
                country_id = Number(ciRows[0].country_id);
            } else {
                country_id = Number(countryRows[0].country_id);
            }
        } else {
            country_id = Number(country_id);
        }

        // Resolve state
        if (typeof state_id !== 'number') {
            // Try exact name, partial name, and restrict by country_id
            const [stateRows] = await pool.query(
                `SELECT state_id FROM state WHERE (state_name = ? OR state_name LIKE ?) AND country_id = ? LIMIT 1`,
                [state_id, `%${state_id}%`, country_id]
            );
            if (!stateRows || stateRows.length === 0) {
                // case-insensitive fallback
                const [ciState] = await pool.query(
                    `SELECT state_id FROM state WHERE LOWER(state_name) = LOWER(?) AND country_id = ? LIMIT 1`,
                    [state_id, country_id]
                );
                if (!ciState || ciState.length === 0) {
                    return res.status(400).json({ success: false, message: 'Invalid state selection' });
                }
                state_id = Number(ciState[0].state_id);
            } else {
                state_id = Number(stateRows[0].state_id);
            }
        } else {
            state_id = Number(state_id);
        }

        // Resolve city
        if (typeof city_id !== 'number') {
            const [cityRows] = await pool.query(
                `SELECT city_id FROM city WHERE (city_name = ? OR city_name LIKE ?) AND state_id = ? LIMIT 1`,
                [city_id, `%${city_id}%`, state_id]
            );
            if (!cityRows || cityRows.length === 0) {
                const [ciCity] = await pool.query(
                    `SELECT city_id FROM city WHERE LOWER(city_name) = LOWER(?) AND state_id = ? LIMIT 1`,
                    [city_id, state_id]
                );
                if (!ciCity || ciCity.length === 0) {
                    return res.status(400).json({ success: false, message: 'Invalid city selection' });
                }
                city_id = Number(ciCity[0].city_id);
            } else {
                city_id = Number(cityRows[0].city_id);
            }
        } else {
            city_id = Number(city_id);
        }

        // Final debug: ensure we have numeric IDs
        console.log('Resolved location IDs (post-resolve) ->', {
          country_id,
          country_type: typeof country_id,
          state_id,
          state_type: typeof state_id,
          city_id,
          city_type: typeof city_id
        });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Debug: log resolved IDs and their types before insert
        console.log('Resolved location IDs ->', {
          country_id,
          country_type: typeof country_id,
          state_id,
          state_type: typeof state_id,
          city_id,
          city_type: typeof city_id
        });

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
            // return the new user's id so frontend can redirect to OTP/verification flow
            res.status(201).json({
                success: true,
                message: "User created successfully!",
                userId: newUserId
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