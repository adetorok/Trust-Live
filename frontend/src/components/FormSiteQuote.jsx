import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { api } from '../utils/api';

const FormSiteQuote = ({ onSuccess }) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const forbiddenDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 
    'icloud.com', 'msn.com', 'live.com', 'yandex.com', 'mail.ru',
    'protonmail.com', 'tutanota.com', 'zoho.com', 'fastmail.com'
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
    return !forbiddenDomains.includes(domain);
  };

  const validatePhone = (phone) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it's a valid US phone number (10 digits) or international (7-15 digits)
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (digitsOnly.length <= 10) {
      if (digitsOnly.length <= 3) return digitsOnly;
      if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }
    
    // For international numbers, just return the digits
    return digitsOnly;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Format phone number as user types
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate individual field on blur
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;
        
      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please use a corporate email address (e.g., name@yourcompany.com)';
        }
        break;
        
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!validatePhone(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
        
      case 'role':
        if (!value) {
          error = 'Please select your role';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return !error;
  };

  const validateForm = () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'role'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors above before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.submitSiteQuote(formData);
      showSuccess('Request submitted successfully! Check your email for verification.');
      onSuccess(formData.email);
    } catch (error) {
      const errorMessage = error.message || 'Failed to submit request. Please try again.';
      showError(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${
              errors.firstName && touched.firstName ? 'border-red-500' : 'border-slate-300'
            }`}
            required
          />
          {errors.firstName && touched.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${
              errors.lastName && touched.lastName ? 'border-red-500' : 'border-slate-300'
            }`}
            required
          />
          {errors.lastName && touched.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="(555) 123-4567"
          className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${
            errors.phone && touched.phone ? 'border-red-500' : 'border-slate-300'
          }`}
          required
        />
        {errors.phone && touched.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Company Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="name@company.com"
          className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${
            errors.email && touched.email ? 'border-red-500' : 'border-slate-300'
          }`}
          required
        />
        {errors.email && touched.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
          Your Site Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${
            errors.role && touched.role ? 'border-red-500' : 'border-slate-300'
          }`}
          required
        >
          <option value="">Select your role...</option>
          <option value="pi">Principal Investigator</option>
          <option value="director">Site Director / Manager</option>
          <option value="crc">Clinical Research Coordinator</option>
          <option value="recruiter">Recruitment Specialist</option>
          <option value="other">Other</option>
        </select>
        {errors.role && touched.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role}</p>
        )}
      </div>
      
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {errors.submit}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-600 text-white font-semibold py-3 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Request Access'
        )}
      </button>
    </form>
  );
};

export default FormSiteQuote;

