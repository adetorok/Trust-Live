import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const StudyManagement = ({ onClose, study = null, onStudySaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    protocolId: '',
    therapeuticArea: '',
    status: 'Planning',
    expectedSubjects: 10,
    startDate: '',
    endDate: '',
    linkedSites: []
  });
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSites();
    if (study) {
      setFormData({
        title: study.title || '',
        protocolId: study.protocolId || '',
        therapeuticArea: study.therapeuticArea || '',
        status: study.status || 'Planning',
        expectedSubjects: study.expectedSubjects || 10,
        startDate: study.startDate ? new Date(study.startDate).toISOString().split('T')[0] : '',
        endDate: study.endDate ? new Date(study.endDate).toISOString().split('T')[0] : '',
        linkedSites: study.linkedSites ? study.linkedSites.map(site => site._id || site) : []
      });
    }
  }, [study]);

  const loadSites = async () => {
    try {
      const response = await api.get('/sites');
      setSites(response.sites);
    } catch (error) {
      console.error('Failed to load sites:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSiteToggle = (siteId) => {
    setFormData(prev => ({
      ...prev,
      linkedSites: prev.linkedSites.includes(siteId)
        ? prev.linkedSites.filter(id => id !== siteId)
        : [...prev.linkedSites, siteId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Study title is required';
    if (!formData.protocolId.trim()) newErrors.protocolId = 'Protocol ID is required';
    if (!formData.therapeuticArea.trim()) newErrors.therapeuticArea = 'Therapeutic area is required';
    if (formData.expectedSubjects < 1) newErrors.expectedSubjects = 'Expected subjects must be at least 1';
    if (formData.linkedSites.length === 0) newErrors.linkedSites = 'At least one site must be selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const studyData = {
        ...formData,
        expectedSubjects: parseInt(formData.expectedSubjects),
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null
      };

      if (study) {
        await api.put(`/studies/${study._id}`, studyData);
      } else {
        await api.post('/studies', studyData);
      }

      onStudySaved();
      onClose();
    } catch (error) {
      console.error('Failed to save study:', error);
      setErrors({ submit: 'Failed to save study. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {study ? 'Edit Study' : 'Create New Study'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Study Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Study Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Study Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter study title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Protocol ID *</label>
                <input
                  type="text"
                  name="protocolId"
                  value={formData.protocolId}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.protocolId ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter protocol ID"
                />
                {errors.protocolId && <p className="mt-1 text-sm text-red-600">{errors.protocolId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Therapeutic Area *</label>
                <input
                  type="text"
                  name="therapeuticArea"
                  value={formData.therapeuticArea}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.therapeuticArea ? 'border-red-300' : ''
                  }`}
                  placeholder="e.g., Cardiology, Oncology"
                />
                {errors.therapeuticArea && <p className="mt-1 text-sm text-red-600">{errors.therapeuticArea}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Recruitment">Recruitment</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Study Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Study Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Subjects *</label>
                <input
                  type="number"
                  name="expectedSubjects"
                  value={formData.expectedSubjects}
                  onChange={handleChange}
                  min="1"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.expectedSubjects ? 'border-red-300' : ''
                  }`}
                />
                {errors.expectedSubjects && <p className="mt-1 text-sm text-red-600">{errors.expectedSubjects}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Linked Sites */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Linked Sites *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-4">
              {sites.map(site => (
                <label key={site._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.linkedSites.includes(site._id)}
                    onChange={() => handleSiteToggle(site._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{site.name}</span>
                </label>
              ))}
            </div>
            {errors.linkedSites && <p className="mt-1 text-sm text-red-600">{errors.linkedSites}</p>}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (study ? 'Update Study' : 'Create Study')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyManagement;
