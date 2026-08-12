const pool = require('../config/db');

const User = {
    // find by username OR email (for register check)
    findByUsernameOrEmail: async (username, email) => {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        return rows[0]; // undefined agar nahi mila
    },

    // find by username (for login)
    findByUsername: async (username) => {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    },

    // find by id (baad me profile/auth middleware ke liye kaam aayega)
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // create new user
    create: async ({ username, email, password, role = 'user' }) => {
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role]
        );
        return result.insertId; // naya user ka id
    }
};

module.exports = User;