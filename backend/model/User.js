const pool = require('../config/db');

const User = {

    findByEmailOrMobile: async (email, mob_no) => {
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE email = ? OR mob_no = ?',
            [email, mob_no]
        );
        return rows[0];
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE user_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async ({ name, password, email, gender, country_name, state_name, city_name, mob_no, otp, otp_expiry }) => {
        const [result] = await pool.query(
            `INSERT INTO user (name, password, email, gender, country_name, state_name, city_name, mob_no, otp, otp_expiry, is_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)`,
            [name, password, email, gender, country_name, state_name, city_name, mob_no, otp, otp_expiry]
        );
        return result.insertId;
    },

    updateOtp: async (email, otp, otp_expiry) => {
        const [result] = await pool.query(
            'UPDATE user SET otp = ?, otp_expiry = ? WHERE email = ?',
            [otp, otp_expiry, email]
        );
        return result;
    },

    markVerified: async (email) => {
        const [result] = await pool.query(
            'UPDATE user SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE email = ?',
            [email]
        );
        return result;
    }
};

module.exports = User;
