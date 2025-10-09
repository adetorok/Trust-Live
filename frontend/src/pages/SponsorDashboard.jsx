import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const SponsorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [studies, setStudies] = useState([]);
  const [sites, setSites] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const changeTab = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(location.search);
    if (tabId === 'overview') {
      params.delete('tab');
    } else {
      params.set('tab', tabId);
    }
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, studiesRes, sitesRes, participantsRes] = await Promise.all([
        api.get('/sponsors/stats'),
        api.get('/sponsors/studies'),
        api.get('/sponsors/sites'),
        api.get('/participants')
      ]);

      setStats(statsRes.stats);
      setStudies(studiesRes.studies);
      setSites(sitesRes.sites);
      setParticipants(participantsRes.participants);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStatus = async (participantId, newStatus) => {
    try {
      await api.put(`/participants/${participantId}`, { status: newStatus });
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to update participant status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'sponsor') {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center p-8 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
          <p className="text-gray-700">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sponsor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'studies', 'sites', 'participants'].map((tab) => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Study Overview</h3>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-blue-600">Active Studies</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{studies.length}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-green-600">Participating Sites</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{sites.length}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-purple-600">Total Participants</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{participants.length}</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-yellow-600">Enrolled</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {participants.filter(p => p.status === 'Enrolled').length}
                </p>
              </div>
            </div>

            {/* Enrollment Progress */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Enrollment Progress by Study</h4>
              {studies.map(study => (
                <div key={study._id} className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{study.title}</span>
                    <span>{study.currentSubjects}/{study.expectedSubjects}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(study.currentSubjects / study.expectedSubjects) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Studies Tab */}
        {activeTab === 'studies' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Studies</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sites</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studies.map(study => (
                    <tr key={study._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.protocolId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          study.status === 'Recruitment' ? 'bg-green-100 text-green-800' : 
                          study.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {study.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {study.currentSubjects}/{study.expectedSubjects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.linkedSites.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sites Tab */}
        {activeTab === 'sites' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Participating Sites</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Studies</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sites.map(site => (
                    <tr key={site._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{site.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.contactName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          site.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          site.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {site.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {studies.filter(s => s.linkedSites.includes(site._id)).length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participants.filter(p => p.siteId._id === site._id).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Study Participants</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map(participant => (
                    <tr key={participant._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.studyId?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.siteId?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          participant.status === 'Enrolled' ? 'bg-green-100 text-green-800' : 
                          participant.status === 'Screening' ? 'bg-yellow-100 text-yellow-800' : 
                          participant.status === 'Potential' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {participant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {participant.status === 'Potential' && (
                            <button
                              onClick={() => updateParticipantStatus(participant._id, 'Screening')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Move to Screening
                            </button>
                          )}
                          {participant.status === 'Screening' && (
                            <button
                              onClick={() => updateParticipantStatus(participant._id, 'Enrolled')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Enroll
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorDashboard;
