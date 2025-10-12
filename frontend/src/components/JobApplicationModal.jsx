import React, { useState } from 'react';

const JobApplicationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    resume: null,
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    referralName: '',
    hearAboutUs: '',
    interestedFunction: '',
    country: '',
    additionalInfo: '',
    futureOpportunities: false,
    isHuman: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.hearAboutUs) newErrors.hearAboutUs = 'Please select how you heard about us';
    if (!formData.interestedFunction) newErrors.interestedFunction = 'Please select your area of interest';
    if (!formData.country) newErrors.country = 'Please select your country';
    if (!formData.isHuman) newErrors.isHuman = 'Please verify you are human';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        resume: null,
        fullName: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        referralName: '',
        hearAboutUs: '',
        interestedFunction: '',
        country: '',
        additionalInfo: '',
        futureOpportunities: false,
        isHuman: false
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">General Application</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Thank you for your interest in TRUST. Please complete this application and let us help identify the right role for you at TRUST.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume/CV (.pdf, .docx, .doc)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded cursor-pointer hover:bg-yellow-500 transition-colors font-medium"
              >
                Choose File
              </label>
              <span className="text-gray-500">
                {formData.resume ? formData.resume.name : 'No file chosen'}
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* Referral */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              If you were referred by a TRUST employee, please enter their name
            </label>
            <input
              type="text"
              name="referralName"
              value={formData.referralName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter referral name"
            />
          </div>

          {/* How did you hear about us */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about TRUST? *
            </label>
            <select
              name="hearAboutUs"
              value={formData.hearAboutUs}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hearAboutUs ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select...</option>
              <option value="website">Company Website</option>
              <option value="linkedin">LinkedIn</option>
              <option value="job-board">Job Board</option>
              <option value="referral">Employee Referral</option>
              <option value="conference">Conference/Event</option>
              <option value="other">Other</option>
            </select>
            {errors.hearAboutUs && <p className="text-red-500 text-sm mt-1">{errors.hearAboutUs}</p>}
          </div>

          {/* Interested Function */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please select the function you are most interested in: *
            </label>
            <select
              name="interestedFunction"
              value={formData.interestedFunction}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.interestedFunction ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select...</option>
              <option value="clinical-research">Clinical Research</option>
              <option value="business-development">Business Development</option>
              <option value="technology">Technology & Innovation</option>
              <option value="operations">Operations & Management</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance & Accounting</option>
              <option value="hr">Human Resources</option>
            </select>
            {errors.interestedFunction && <p className="text-red-500 text-sm mt-1">{errors.interestedFunction}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are you from USA or Canada: *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a country</option>
              <option value="usa">United States</option>
              <option value="canada">Canada</option>
              <option value="other">Other</option>
            </select>
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please let us know if there's anything else you would like to share with us
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us more about yourself, your experience, or why you're interested in joining TRUST..."
            />
          </div>

          {/* Recruitment Fraud Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-gray-700">
              <strong>Notice: Beware of Recruitment Fraud</strong><br />
              TRUST only uses official email addresses ending in "@trustclinicalservices.com" for recruitment purposes. 
              If you receive any suspicious communications claiming to be from TRUST, please report them immediately.
            </p>
          </div>

          {/* Future Opportunities Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="futureOpportunities"
              checked={formData.futureOpportunities}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Yes, TRUST Clinical Services can contact me about future job opportunities for up to 2 years.
            </label>
          </div>

          {/* Human Verification */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isHuman"
              checked={formData.isHuman}
              onChange={handleInputChange}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                errors.isHuman ? 'border-red-500' : ''
              }`}
            />
            <label className="ml-2 text-sm text-gray-700">
              I am human
            </label>
            <span className="ml-2 text-xs text-gray-500">Privacy - Terms</span>
          </div>
          {errors.isHuman && <p className="text-red-500 text-sm mt-1">{errors.isHuman}</p>}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-md font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT APPLICATION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;
