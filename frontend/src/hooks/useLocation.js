import { useState, useEffect } from 'react';
import { locationService } from '../services/locationService';

export const useLocation = (selectedCountry, selectedState) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      setLocationError('');
      try {
        const data = await locationService.getCountries();
        if (isMounted) setCountries(data);
      } catch (err) {
        if (isMounted) setLocationError(err.message);
      } finally {
        if (isMounted) setIsLoadingCountries(false);
      }
    };
    
    fetchCountries();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStates = async () => {
      if (!selectedCountry) {
        setStates([]);
        return;
      }
      setIsLoadingStates(true);
      setLocationError('');
      try {
        const data = await locationService.getStates(selectedCountry);
        if (isMounted) setStates(data);
      } catch (err) {
        if (isMounted) setLocationError(err.message);
      } finally {
        if (isMounted) setIsLoadingStates(false);
      }
    };

    fetchStates();
    return () => { isMounted = false; };
  }, [selectedCountry]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchCities = async () => {
      if (!selectedCountry || !selectedState) {
        setCities([]);
        return;
      }
      setIsLoadingCities(true);
      setLocationError('');
      try {
        const data = await locationService.getCities(selectedCountry, selectedState);
        if (isMounted) setCities(data);
      } catch (err) {
        if (isMounted) setLocationError(err.message);
      } finally {
        if (isMounted) setIsLoadingCities(false);
      }
    };

    fetchCities();
    return () => { isMounted = false; };
  }, [selectedCountry, selectedState]);

  return {
    countries,
    states,
    cities,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
    locationError
  };
};
