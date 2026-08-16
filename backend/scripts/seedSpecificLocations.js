require('dotenv').config();
const pool = require('../config/db');
const { Country, State, City } = require('country-state-city');

const NAMES = ['India', 'Afghanistan'];

async function seedSpecific() {
  try {
    console.log('Seeding specific countries:', NAMES.join(', '));

    for (const name of NAMES) {
      // find country by name or iso
      const all = Country.getAllCountries();
      const found = all.find(c => c.name.toLowerCase() === name.toLowerCase() || c.isoCode.toLowerCase() === name.toLowerCase());
      if (!found) {
        console.warn('Country not found in library:', name);
        continue;
      }
      const iso = found.isoCode;

      const [res] = await pool.query('SELECT country_id FROM country WHERE country_code = ? OR country_name = ? LIMIT 1', [iso, found.name]);
      let countryId;
      if (res.length === 0) {
        const insert = await pool.query('INSERT INTO country (country_name, country_code) VALUES (?, ?)', [found.name, iso]);
        countryId = insert[0].insertId;
      } else {
        countryId = res[0].country_id;
      }

      console.log('Country seeded:', found.name, 'id=', countryId);

      // seed states
      const states = State.getStatesOfCountry(iso) || [];
      for (const s of states) {
        const [sres] = await pool.query('SELECT state_id FROM state WHERE state_name = ? AND country_id = ? LIMIT 1', [s.name, countryId]);
        let stateId;
        if (sres.length === 0) {
          const insertState = await pool.query('INSERT INTO state (country_id, state_name) VALUES (?, ?)', [countryId, s.name]);
          stateId = insertState[0].insertId;
        } else {
          stateId = sres[0].state_id;
        }
      }

      console.log('States for', found.name, 'seeded:', states.length);

      // optionally seed cities for a couple of key states (e.g., for India: Maharashtra)
      const targetStates = {
        India: ['Maharashtra', 'Karnataka'],
        Afghanistan: ['Badakhshan', 'Kandahar']
      };

      const toSeedStates = targetStates[found.name] || [];

      for (const stateName of toSeedStates) {
        // find state id
        const [stRows] = await pool.query('SELECT state_id FROM state WHERE LOWER(state_name) = LOWER(?) AND country_id = ? LIMIT 1', [stateName, countryId]);
        if (stRows.length === 0) continue;
        const stateId = stRows[0].state_id;

        const cities = City.getCitiesOfState(iso, City.getCitiesOfState ? State.getStatesOfCountry : undefined) || [];
        // safer: use City.getCitiesOfState(iso, stateIso)
        const stateObj = State.getStatesOfCountry(iso).find(x => x.name.toLowerCase() === stateName.toLowerCase());
        if (!stateObj) continue;
        const cityList = City.getCitiesOfState(iso, stateObj.isoCode) || [];
        for (const city of cityList) {
          const [cres] = await pool.query('SELECT city_id FROM city WHERE city_name = ? AND state_id = ? LIMIT 1', [city.name, stateId]);
          if (cres.length === 0) {
            await pool.query('INSERT INTO city (state_id, city_name) VALUES (?, ?)', [stateId, city.name]);
          }
        }
        console.log('Seeded cities for', stateName, 'count=', cityList.length);
      }

    }

    console.log('Specific seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seedSpecific();
