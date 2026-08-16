import { Country, State, City } from 'country-state-city';

// Simulate network delay for future API replacement readiness
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: resolve a country identifier (isoCode or name) to its isoCode
const resolveCountryIso = (identifier) => {
  if (!identifier) return null;
  const all = Country.getAllCountries();
  const found = all.find(c => (
    c.isoCode.toLowerCase() === String(identifier).toLowerCase()
    || c.name.toLowerCase() === String(identifier).toLowerCase()
  ));
  return found ? found.isoCode : null;
};

// Helper: resolve a state identifier (isoCode or name) within a country to its isoCode
const resolveStateIso = (countryIso, identifier) => {
  if (!countryIso || !identifier) return null;
  const states = State.getStatesOfCountry(countryIso) || [];
  const found = states.find(s => (
    s.isoCode.toLowerCase() === String(identifier).toLowerCase()
    || s.name.toLowerCase() === String(identifier).toLowerCase()
  ));
  return found ? found.isoCode : null;
};

export const locationService = {
  getCountries: async () => {
    try {
      await delay(300); // Simulated delay
      const countries = Country.getAllCountries().map(c => ({
        // use country name as the value so backend can resolve by name
        value: c.name,
        label: c.name,
        phonecode: c.phonecode
      }));
      return countries;
    } catch (error) {
      throw new Error('Unable to load locations. Please try again.');
    }
  },

  getStates: async (countryIdentifier) => {
    try {
      if (!countryIdentifier) return [];
      await delay(300); // Simulated delay

      // countryIdentifier may be a name (e.g. "India") or an isoCode (e.g. "IN")
      const countryIso = resolveCountryIso(countryIdentifier);
      if (!countryIso) return [];

      const states = State.getStatesOfCountry(countryIso).map(s => ({
        // use state name so backend can resolve by name
        value: s.name,
        label: s.name
      }));
      return states;
    } catch (error) {
      throw new Error('Unable to load locations. Please try again.');
    }
  },

  getCities: async (countryIdentifier, stateIdentifier) => {
    try {
      if (!countryIdentifier || !stateIdentifier) return [];
      await delay(300); // Simulated delay

      const countryIso = resolveCountryIso(countryIdentifier);
      if (!countryIso) return [];

      const stateIso = resolveStateIso(countryIso, stateIdentifier);
      if (!stateIso) return [];

      const cities = City.getCitiesOfState(countryIso, stateIso).map(c => ({
        value: c.name,
        label: c.name
      }));
      return cities;
    } catch (error) {
      throw new Error('Unable to load locations. Please try again.');
    }
  }
};
