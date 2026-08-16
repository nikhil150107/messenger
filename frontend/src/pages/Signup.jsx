import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Globe, MapPin, Building2, MessageSquare } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Select from '../components/Select';
import SearchableSelect from '../components/SearchableSelect';
import PhoneInput from '../components/PhoneInput';
import Button from '../components/Button';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '', gender: '', mobile: '', email: '',
    password: '', confirmPassword: '', country: '', state: '', city: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [callingCode, setCallingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const {
    countries: countryOptions, states: stateOptions, cities: cityOptions,
    isLoadingCountries, isLoadingStates, isLoadingCities, locationError
  } = useLocation(formData.country, formData.state);

  const genderOptions = [
    { value: '', label: 'Select Gender', disabled: true },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

  useEffect(() => {
    if (formData.country) {
      const selected = countryOptions.find(c => c.value === formData.country);
      setCallingCode(selected?.phonecode || '');
    } else {
      setCallingCode('');
    }
  }, [formData.country, countryOptions]);

  const validateField = (name, value, currentFormData = formData) => {
    switch (name) {
      case 'fullName': return (!value.trim() || value.trim().length < 2) ? 'Please enter your full name.' : '';
      case 'gender': return !value ? 'Please select your gender.' : '';
      case 'mobile':
        if (!value) return "Mobile number can't be blank.";
        return !/^\d{7,15}$/.test(value.replace(/[^0-9]/g, '')) ? 'Please enter a valid mobile number.' : '';
      case 'email':
        if (!value) return "Email can't be blank.";
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address.' : '';
      case 'password':
        if (!value) return "Password can't be blank.";
        return !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value)
          ? 'Must contain 8+ chars, 1 uppercase, 1 number, 1 special char.' : '';
      case 'confirmPassword':
        return (!value || value !== currentFormData.password) ? 'Passwords do not match.' : '';
      case 'country': return !value ? 'Please select a country.' : '';
      case 'state': return (!value && currentFormData.country) ? 'Please select a state.' : '';
      case 'city': return (!value && currentFormData.state) ? 'Please select a city.' : '';
      default: return '';
    }
  };

  const handleBlur = (e) => {
    const target = e.target || e;
    const { id, value } = target;
    if (!id) return;
    setTouched(prev => ({ ...prev, [id]: true }));
    setErrors(prev => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [id]: value };
      if (touched[id] || errors[id]) setErrors(p => ({ ...p, [id]: validateField(id, value, newData) }));
      if (id === 'password' && (touched.confirmPassword || errors.confirmPassword)) {
        setErrors(p => ({ ...p, confirmPassword: validateField('confirmPassword', newData.confirmPassword, newData) }));
      }
      return newData;
    });
  };

  const handleDropdownChange = (id, value) => {
    setFormData(prev => {
      const newData = { ...prev, [id]: value };
      if (id === 'country') { newData.state = ''; newData.city = ''; }
      if (id === 'state') { newData.city = ''; }
      if (touched[id] || errors[id]) setErrors(p => ({ ...p, [id]: validateField(id, value, newData) }));
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = {};
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched(newTouched);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const payload = {
        name: formData.fullName.trim(),
        gender: formData.gender,
        mob_no: `+${callingCode}${formData.mobile.replace(/[^0-9]/g, '')}`,
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        country_id: formData.country,
        state_id: formData.state,
        city_id: formData.city,
      };

      const { data } = await axios.post(`${BASE_URL}/api/auth/register`, payload);

      if (data.success && data.userId) {
        navigate('/verify-otp', { state: { userId: data.userId, email: formData.email.trim() } });
      } else {
        setApiError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex">
      {/* Desktop Left Panel */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-blue-600 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,70 70,30 100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Messenger</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Connect with friends globally.</h1>
          <p className="text-blue-100 text-lg max-w-md">Join thousands of users on Messenger. Experience seamless, secure, and fast communication from anywhere in the world.</p>
        </div>
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <img key={i} className="w-12 h-12 rounded-full border-2 border-blue-600 object-cover"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                ))}
              </div>
              <div>
                <p className="font-medium text-white">Join our community</p>
                <p className="text-blue-200 text-sm">Over 10M+ active users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col px-6 py-6 md:px-10 lg:px-16 h-screen overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">
          <div className="flex items-center gap-3 mb-8 md:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Messenger</span>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an Account</h2>
            <p className="text-gray-500 text-sm">Sign up to get started with Messenger</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              <span className="font-medium">{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="fullName" label="Full Name" placeholder="Enter your full name" icon={User}
                value={formData.fullName} onChange={handleChange} onBlur={handleBlur} error={errors.fullName} />
              <Select id="gender" label="Gender" options={genderOptions} value={formData.gender}
                onChange={handleChange} onBlur={handleBlur} icon={User} error={errors.gender} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhoneInput id="mobile" label="Mobile Number" placeholder="Enter your mobile number"
                countryCallingCode={callingCode} value={formData.mobile}
                onChange={handleChange} onBlur={handleBlur} error={errors.mobile} />
              <Input id="email" type="email" label="Email" placeholder="Enter your email address" icon={Mail}
                value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput id="password" label="Password" placeholder="Create password"
                value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
              <PasswordInput id="confirmPassword" label="Confirm Password" placeholder="Confirm password"
                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword} />
            </div>

            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Location Details</h3>
              {locationError && <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{locationError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SearchableSelect id="country" label="Country"
                  placeholder={isLoadingCountries ? 'Loading...' : 'Select Country'}
                  options={countryOptions} value={formData.country}
                  onChange={(val) => handleDropdownChange('country', val)}
                  onBlur={handleBlur} disabled={isLoadingCountries} icon={Globe} error={errors.country} />
                <SearchableSelect id="state" label="State"
                  placeholder={isLoadingStates ? 'Loading...' : 'Select State'}
                  options={stateOptions} value={formData.state}
                  onChange={(val) => handleDropdownChange('state', val)}
                  onBlur={handleBlur} disabled={!formData.country || isLoadingStates} icon={MapPin} error={errors.state} />
                <SearchableSelect id="city" label="City"
                  placeholder={isLoadingCities ? 'Loading...' : 'Select City'}
                  options={cityOptions} value={formData.city}
                  onChange={(val) => handleDropdownChange('city', val)}
                  onBlur={handleBlur} disabled={!formData.state || isLoadingCities} icon={Building2} error={errors.city} />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
