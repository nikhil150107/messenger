const pool = require('../config/db');

const Location = {
    getAllCountries: async () => {
        const [rows] = await pool.query('SELECT * FROM country');
        return rows;
    },

    getStatesByCountry: async (country_id) => {
        const [rows] = await pool.query(
            'SELECT * FROM state WHERE country_id = ?',
            [country_id]
        );
        return rows;
    },

    getCitiesByState: async (state_id) => {
        const [rows] = await pool.query(
            'SELECT * FROM city WHERE state_id = ?',
            [state_id]
        );
        return rows;
    }
};

module.exports = Location;