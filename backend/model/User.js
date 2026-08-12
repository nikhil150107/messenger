const pool = require('../config/db');

const User = {
    // find by email OR mobile (for register check)
    findByEmailOrMobile: async (email, mob_no) => {
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE email = ? OR mob_no = ?',
            [email, mob_no]
        );
        return rows[0];
    },

    // find by email (for login) - joined with country/state/city names
    findByEmail: async (email) => {
        const [rows] = await pool.query(
            `SELECT u.*, c.country_name, s.state_name, ci.city_name
             FROM user u
             JOIN country c ON u.country_id = c.country_id
             JOIN state s ON u.state_id = s.state_id
             JOIN city ci ON u.city_id = ci.city_id
             WHERE u.email = ?`,
            [email]
        );
        return rows[0];
    },

    // find by id
    findById: async (id) => {
        const [rows] = await pool.query(
            `SELECT u.user_id, u.name, u.email, u.gender, u.mob_no,
                    c.country_name, s.state_name, ci.city_name,
                    u.created_date, u.update_date
             FROM user u
             JOIN country c ON u.country_id = c.country_id
             JOIN state s ON u.state_id = s.state_id
             JOIN city ci ON u.city_id = ci.city_id
             WHERE u.user_id = ?`,
            [id]
        );
        return rows[0];
    },

    // create new user
    create: async ({ name, password, email, gender, country_id, state_id, city_id, mob_no }) => {
        const [result] = await pool.query(
            `INSERT INTO user (name, password, email, gender, country_id, state_id, city_id, mob_no)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, password, email, gender, country_id, state_id, city_id, mob_no]
        );
        return result.insertId;
    }
};

module.exports = User;