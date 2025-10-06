import React, { useState, useEffect } from 'react';

const EnhancedProposalForm = ({ isOpen, onClose, formType, onSuccess }) => {
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    email: '',
    phone: '',
    company: '',
    role: formType || 'sponsor',
    
    // Study info
    studyName: '',
    therapeuticDiscipline: '',
    numberOfStudies: 1,
    
    // Sponsor/CRO specific
    numberOfSites: '',
    studyScope: 'US', // US or Global
    fpfvDate: '',
    studyDuration: '',
    studyDurationUnit: 'months',
    
    // Site specific
    numberOfSubjects: '',
    activationDate: '',
    studyEndDate: '',
    
    // Additional info
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Professional email validation
  const isProfessionalEmail = (email) => {
    const personalDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
      'icloud.com', 'me.com', 'mac.com', 'live.com', 'msn.com',
      'ymail.com', 'rocketmail.com', 'mail.com', 'protonmail.com',
      'tutanota.com', 'zoho.com', 'fastmail.com', 'gmx.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !personalDomains.includes(domain);
  };

  const therapeuticDisciplines = [
    'Oncology',
    'Cardiology',
    'Neurology',
    'Gastroenterology',
    'Dermatology',
    'Endocrinology',
    'Hematology',
    'Immunology',
    'Infectious Diseases',
    'Rare Diseases',
    'Other'
  ];

  const numberOfSitesOptions = [
    { value: '1-5', label: '1-5 sites' },
    { value: '6-10', label: '6-10 sites' },
    { value: '11-20', label: '11-20 sites' },
    { value: '21-50', label: '21-50 sites' },
    { value: '51-100', label: '51-100 sites' },
    { value: '100+', label: '100+ sites' }
  ];

  const studyDurationOptions = [
    { value: '1-3', label: '1-3 months' },
    { value: '3-6', label: '3-6 months' },
    { value: '6-12', label: '6-12 months' },
    { value: '12-18', label: '12-18 months' },
    { value: '18-24', label: '18-24 months' },
    { value: '24+', label: '24+ months' }
  ];

  const numberOfSubjectsOptions = [
    { value: '1-10', label: '1-10 subjects' },
    { value: '11-25', label: '11-25 subjects' },
    { value: '26-50', label: '26-50 subjects' },
    { value: '51-100', label: '51-100 subjects' },
    { value: '101-200', label: '101-200 subjects' },
    { value: '200+', label: '200+ subjects' }
  ];

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Handle ESC key press
      const handleEscKey = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscKey);
      
      setFormData(prev => ({
        ...prev,
        role: formType || 'sponsor'
      }));
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    } else {
      // Unlock body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, formType, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate professional email
      if (!isProfessionalEmail(formData.email)) {
        setError('Please use a professional company email address. Personal emails (Gmail, Yahoo, etc.) are not accepted.');
        setLoading(false);
        return;
      }

      // Submit to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit proposal');
      }
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: formType || 'sponsor',
        studyName: '',
        therapeuticDiscipline: '',
        numberOfStudies: 1,
        numberOfSites: '',
        studyScope: 'US',
        fpfvDate: '',
        studyDuration: '',
        studyDurationUnit: 'months',
        numberOfSubjects: '',
        activationDate: '',
        studyEndDate: '',
        message: ''
      });
    } catch (error) {
      setError(error.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${formType === 'sponsor' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
              <h2 className="text-3xl font-bold text-gray-900">
                {formType === 'sponsor' ? 'Sponsor/CRO Proposal Request' : 'Site/Vendor Proposal Request'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <div className={`p-4 rounded-lg ${formType === 'sponsor' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
            <p className={`text-lg font-medium ${formType === 'sponsor' ? 'text-blue-800' : 'text-green-800'}`}>
              {formType === 'sponsor' 
                ? 'Complete this form to request a proposal for your clinical trial study. We\'ll help you accelerate enrollment and reduce costs.'
                : 'Complete this form to join our network of research sites. We\'ll help you enhance your recruitment capabilities and increase enrollment.'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.name@company.com"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Please use your professional company email address. Personal emails (Gmail, Yahoo, etc.) are not accepted.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Study Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Studies *</label>
                <select
                  name="numberOfStudies"
                  value={formData.numberOfStudies}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={1}>1 Study</option>
                  <option value={2}>2 Studies</option>
                  <option value={3}>3 Studies</option>
                  <option value={4}>4 Studies</option>
                  <option value={5}>5+ Studies</option>
                </select>
              </div>

              {formData.numberOfStudies === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Study Name (Optional)</label>
                    <input
                      type="text"
                      name="studyName"
                      value={formData.studyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter study name if available"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Therapeutic Discipline *</label>
                    <select
                      name="therapeuticDiscipline"
                      value={formData.therapeuticDiscipline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Therapeutic Discipline</option>
                      {therapeuticDisciplines.map(discipline => (
                        <option key={discipline} value={discipline}>{discipline}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sponsor/CRO Specific Fields */}
          {formType === 'sponsor' && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-blue-900">Sponsor/CRO Study Details</h3>
              </div>
              <p className="text-blue-700 text-sm mb-4">Provide details about your clinical trial study requirements</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Scope *</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="studyScope"
                        value="US"
                        checked={formData.studyScope === 'US'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      US Only
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="studyScope"
                        value="Global"
                        checked={formData.studyScope === 'Global'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Global
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sites *</label>
                  <select
                    name="numberOfSites"
                    value={formData.numberOfSites}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select number of sites</option>
                    {numberOfSitesOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Patient First Visit (FPFV) Date *</label>
                  <input
                    type="date"
                    name="fpfvDate"
                    value={formData.fpfvDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Duration *</label>
                  <select
                    name="studyDuration"
                    value={formData.studyDuration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select study duration</option>
                    {studyDurationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Site Specific Fields */}
          {formType === 'site' && (
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-green-900">Site Study Details</h3>
              </div>
              <p className="text-green-700 text-sm mb-4">Provide details about your research site capabilities and study requirements</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Number of Subjects *</label>
                  <select
                    name="numberOfSubjects"
                    value={formData.numberOfSubjects}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select expected number of subjects</option>
                    {numberOfSubjectsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Activation Date *</label>
                  <input
                    type="date"
                    name="activationDate"
                    value={formData.activationDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Study End Date *</label>
                  <input
                    type="date"
                    name="studyEndDate"
                    value={formData.studyEndDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide any additional details about your study or requirements..."
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedProposalForm;
