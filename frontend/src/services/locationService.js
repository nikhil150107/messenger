import { Country, State, City } from 'country-state-city';

// Simulate network delay for future API replacement readiness
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const locationService = {
  getCountries: async () => {
    try {
      await delay(300); // Simulated delay
      const countries = Country.getAllCountries().map(c => ({
        value: c.isoCode,
        label: c.name,
        phonecode: c.phonecode
      }));
      return countries;
    } catch (error) {
      throw new Error('Unable to load locations. Please try again.');
    }
  },

  getStates: async (countryCode) => {
    try {
      if (!countryCode) return [];
      await delay(300); // Simulated delay
      const states = State.getStatesOfCountry(countryCode).map(s => ({
        value: s.isoCode,
        label: s.name
      }));
      return states;
    } catch (error) {
      throw new Error('Unable to load locations. Please try again.');
    }
  },

  getCities: async (countryCode, stateCode) => {
    try {
      if (!countryCode || !stateCode) return [];
      await delay(300); // Simulated delay
      const cities = City.getCitiesOfState(countryCode, stateCode).map(c => ({
        value: c.name,
        label: c.name
      }));
      return cities;
    } catch (error) {
      throw new Error('Unable to load locations. Please try again.');
    }
  }
};
