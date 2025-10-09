import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const StudyModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    protocolId: '',
    therapeuticArea: '',
    sponsorId: '',
    expectedSubjects: '',
    linkedSites: []
  });
  const [sponsors, setSponsors] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSponsorsAndSites();
    }
  }, [isOpen]);

  const loadSponsorsAndSites = async () => {
    try {
      const [sponsorsRes, sitesRes] = await Promise.all([
        api.get('/sponsors'),
        api.get('/admin/sites')
      ]);
      setSponsors(sponsorsRes.sponsors || []);
      setSites(sitesRes.sites || []);
    } catch (error) {
      console.error('Failed to load sponsors and sites:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/admin/studies', formData);
      onSuccess();
      onClose();
      setFormData({
        title: '',
        protocolId: '',
        therapeuticArea: '',
        sponsorId: '',
        expectedSubjects: '',
        linkedSites: []
      });
    } catch (error) {
      setError(error.message || 'Failed to create study');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedSitesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value).filter(v => v);
    setFormData(prev => ({ ...prev, linkedSites: selected }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Study</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Study Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Protocol ID</label>
              <input
                type="text"
                value={formData.protocolId}
                onChange={(e) => setFormData({...formData, protocolId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Therapeutic Area</label>
              <input
                type="text"
                value={formData.therapeuticArea}
                onChange={(e) => setFormData({...formData, therapeuticArea: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Oncology, Cardiology"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Subjects</label>
              <input
                type="number"
                value={formData.expectedSubjects}
                onChange={(e) => setFormData({...formData, expectedSubjects: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sponsor</label>
            <select
              value={formData.sponsorId}
              onChange={(e) => setFormData({...formData, sponsorId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Sponsor</option>
              {sponsors.map(sponsor => (
                <option key={sponsor._id} value={sponsor._id}>{sponsor.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Linked Sites (Optional)</label>
            {sites.length === 0 ? (
              <div className="text-sm text-gray-500 border border-gray-300 rounded-md p-3">No sites available yet.</div>
            ) : (
              <select
                multiple
                value={formData.linkedSites}
                onChange={handleLinkedSitesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {sites.map(site => (
                  <option key={site._id} value={site._id}>{site.name}</option>
                ))}
              </select>
            )}
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
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Study'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyModal;
