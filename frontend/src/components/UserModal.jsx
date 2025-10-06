import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const UserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'site',
    sponsorId: '',
    siteId: ''
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
      await api.post('/admin/users', formData);
      onSuccess();
      onClose();
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'site',
        sponsorId: '',
        siteId: ''
      });
    } catch (error) {
      setError(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@company.com"
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              Professional company email required. Personal emails not accepted.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="sponsor">Sponsor</option>
              <option value="site">Site</option>
            </select>
          </div>

          {formData.role === 'sponsor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Sponsor</label>
              <select
                value={formData.sponsorId}
                onChange={(e) => setFormData({...formData, sponsorId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Sponsor</option>
                {sponsors.map(sponsor => (
                  <option key={sponsor._id} value={sponsor._id}>{sponsor.name}</option>
                ))}
              </select>
            </div>
          )}

          {formData.role === 'site' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Site</label>
              <select
                value={formData.siteId}
                onChange={(e) => setFormData({...formData, siteId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Site</option>
                {sites.map(site => (
                  <option key={site._id} value={site._id}>{site.name}</option>
                ))}
              </select>
            </div>
          )}

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
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
