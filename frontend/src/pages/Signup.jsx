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
          ? 'Min 8 chars, 1 uppercase, 1 number, 1 special character.' : '';
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
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white" size={17} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Messenger</span>
        </div>
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-semibold hover:underline underline-offset-4">Sign in</Link>
        </p>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="text-slate-500 text-sm mt-2">Sign up to discover and share daily quotes</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {apiError && (
              <div className="mx-6 mt-6 p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-6">

              {/* Personal Info */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={12} /> Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="fullName" label="Full Name" placeholder="John Doe"
                    leftIcon={<User size={15} className="text-slate-400" />}
                    value={formData.fullName} onChange={handleChange} onBlur={handleBlur} error={errors.fullName} />
                  <Select id="gender" label="Gender" options={genderOptions} value={formData.gender}
                    onChange={handleChange} onBlur={handleBlur} icon={User} error={errors.gender} />
                  <PhoneInput id="mobile" label="Mobile Number" placeholder="9876543210"
                    countryCallingCode={callingCode} value={formData.mobile}
                    onChange={handleChange} onBlur={handleBlur} error={errors.mobile} />
                  <Input id="email" type="email" label="Email Address" placeholder="john@example.com"
                    leftIcon={<Mail size={15} className="text-slate-400" />}
                    value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Password */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Password
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordInput id="password" label="Password" placeholder="Create a strong password"
                    value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
                  <PasswordInput id="confirmPassword" label="Confirm Password" placeholder="Repeat your password"
                    value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword} />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Location */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe size={12} /> Location
                </h3>
                {locationError && (
                  <div className="mb-3 p-2.5 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{locationError}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              {/* Submit */}
              <Button type="submit" disabled={isLoading} fullWidth>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 font-semibold hover:underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
