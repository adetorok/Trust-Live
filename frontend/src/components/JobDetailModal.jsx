import React, { useState } from 'react';

const JobDetailModal = ({ isOpen, onClose, job, onSuccess }) => {
  const [formData, setFormData] = useState({
    resume: null,
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    coverLetter: '',
    referralName: '',
    hearAboutUs: '',
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
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.hearAboutUs) newErrors.hearAboutUs = 'Please select how you heard about us';
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
        coverLetter: '',
        referralName: '',
        hearAboutUs: '',
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

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>{job.team}</span>
                <span>•</span>
                <span>{job.region}</span>
                <span>•</span>
                <span>{job.location}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Job Description */}
          <div className="lg:w-2/3 p-6">
            <div className="space-y-6">
              {/* Job Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Overview</h3>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Offer</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Competitive salary and comprehensive benefits package</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Flexible work arrangements and remote options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Professional development and training opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Health, dental, and vision insurance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">401(k) retirement plan with company matching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Paid time off and holidays</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:w-1/3 bg-gray-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this Position</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV (.pdf, .docx, .doc) *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="bg-blue-600 text-white px-3 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Choose File
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.resume ? formData.resume.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              {/* Referral */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Name
                </label>
                <input
                  type="text"
                  name="referralName"
                  value={formData.referralName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="If referred by a TRUST employee"
                />
              </div>

              {/* How did you hear about us */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How did you hear about us? *
                </label>
                <select
                  name="hearAboutUs"
                  value={formData.hearAboutUs}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
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
                {errors.hearAboutUs && <p className="text-red-500 text-xs mt-1">{errors.hearAboutUs}</p>}
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
                  I am human *
                </label>
              </div>
              {errors.isHuman && <p className="text-red-500 text-xs mt-1">{errors.isHuman}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
