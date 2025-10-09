import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const SiteModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    addressCountry: 'US',
    contactName: '',
    contactEmail: '',
    phone: '',
    sponsorId: ''
  });
  const [sponsors, setSponsors] = useState([]);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSponsorsAndStudies();
    }
  }, [isOpen]);

  const loadSponsorsAndStudies = async () => {
    try {
      const [sponsorsRes, studiesRes] = await Promise.all([
        api.get('/sponsors'),
        api.get('/admin/studies')
      ]);
      setSponsors(sponsorsRes.sponsors || []);
      setStudies(studiesRes.studies || []);
    } catch (error) {
      console.error('Failed to load sponsors/studies:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        address: {
          street: formData.addressStreet,
          city: formData.addressCity,
          state: formData.addressState,
          zip: formData.addressZip,
          country: formData.addressCountry || 'US'
        },
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        phone: formData.phone,
        sponsorId: formData.sponsorId,
      };

      await api.post('/admin/sites', payload);
      onSuccess();
      onClose();
      setFormData({
        name: '',
        addressStreet: '',
        addressCity: '',
        addressState: '',
        addressZip: '',
        addressCountry: 'US',
        contactName: '',
        contactEmail: '',
        phone: '',
        sponsorId: ''
      });
    } catch (error) {
      setError(error.message || 'Failed to create site');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Site</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Street Address"
                value={formData.addressStreet}
                onChange={(e) => setFormData({...formData, addressStreet: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.addressCity}
                onChange={(e) => setFormData({...formData, addressCity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="State/Province"
                value={formData.addressState}
                onChange={(e) => setFormData({...formData, addressState: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="ZIP/Postal Code"
                value={formData.addressZip}
                onChange={(e) => setFormData({...formData, addressZip: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.addressCountry}
                onChange={(e) => setFormData({...formData, addressCountry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
            <label className="block text-sm font-medium text-gray-700">Associate Study</label>
            <select
              value={formData.studyId || ''}
              onChange={(e) => setFormData({...formData, studyId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Study</option>
              {studies.map(study => (
                <option key={study._id} value={study._id}>{study.title}</option>
              ))}
            </select>
            {studies.length === 0 && (
              <div className="text-xs text-gray-500 mt-1">No studies found. Please create a study first from the dashboard.</div>
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
              {loading ? 'Creating...' : 'Create Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteModal;
