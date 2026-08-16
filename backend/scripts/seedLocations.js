require('dotenv').config();
const pool = require('../config/db');
const { Country, State, City } = require('country-state-city');

async function seed() {
  try {
    console.log('Seeding countries...');
    const countries = Country.getAllCountries();
    for (const c of countries) {
      const [res] = await pool.query('SELECT country_id FROM country WHERE country_code = ? LIMIT 1', [c.isoCode]);
      let countryId;
      if (res.length === 0) {
        const insert = await pool.query('INSERT INTO country (country_name, country_code) VALUES (?, ?)', [c.name, c.isoCode]);
        countryId = insert[0].insertId;
      } else {
        countryId = res[0].country_id;
      }

      // seed states for the country
      const states = State.getStatesOfCountry(c.isoCode) || [];
      for (const s of states) {
        const [sres] = await pool.query('SELECT state_id FROM state WHERE state_name = ? AND country_id = ? LIMIT 1', [s.name, countryId]);
        let stateId;
        if (sres.length === 0) {
          const insertState = await pool.query('INSERT INTO state (country_id, state_name) VALUES (?, ?)', [countryId, s.name]);
          stateId = insertState[0].insertId;
        } else {
          stateId = sres[0].state_id;
        }

        // seed cities for state (may be many) — keep it safe: only seed if there are cities
        const cities = City.getCitiesOfState(c.isoCode, s.isoCode) || [];
        for (const city of cities) {
          const [cres] = await pool.query('SELECT city_id FROM city WHERE city_name = ? AND state_id = ? LIMIT 1', [city.name, stateId]);
          if (cres.length === 0) {
            await pool.query('INSERT INTO city (state_id, city_name) VALUES (?, ?)', [stateId, city.name]);
          }
        }
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
