import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import RoleBasedParticipantView from '../components/RoleBasedParticipantView';

const SiteDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [participantsRes, studiesRes] = await Promise.all([
        api.get('/participants'),
        api.get('/studies')
      ]);

      setParticipants(participantsRes.participants);
      setStudies(studiesRes.studies);
      
      // Calculate stats
      const totalParticipants = participantsRes.participants.length;
      const enrolledCount = participantsRes.participants.filter(p => p.status === 'Enrolled').length;
      const screeningCount = participantsRes.participants.filter(p => p.status === 'Screening').length;
      const potentialCount = participantsRes.participants.filter(p => p.status === 'Potential').length;
      
      setStats({
        totalParticipants,
        enrolledCount,
        screeningCount,
        potentialCount,
        enrollmentRate: totalParticipants > 0 ? Math.round((enrolledCount / totalParticipants) * 100) : 0
      });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Enrolled': return 'bg-green-100 text-green-800';
      case 'Screening': return 'bg-yellow-100 text-yellow-800';
      case 'Potential': return 'bg-blue-100 text-blue-800';
      case 'Disqualified': return 'bg-red-100 text-red-800';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Potential': return 'Screening';
      case 'Screening': return 'Enrolled';
      case 'Enrolled': return 'Completed';
      default: return null;
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

  if (!user || user.role !== 'site') {
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
        <h1 className="text-3xl font-bold text-gray-900">Site Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'participants', 'workflow'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
            <h3 className="text-lg font-medium text-gray-900 mb-6">Site Performance Overview</h3>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-blue-600">Total Participants</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalParticipants || 0}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-green-600">Enrolled</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.enrolledCount || 0}</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-yellow-600">In Screening</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.screeningCount || 0}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-purple-600">Enrollment Rate</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.enrollmentRate || 0}%</p>
              </div>
            </div>

            {/* Participant Status Distribution */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Participant Status Distribution</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['Potential', 'Screening', 'Enrolled', 'Disqualified', 'Withdrawn'].map(status => {
                  const count = participants.filter(p => p.status === status).length;
                  return (
                    <div key={status} className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                        {status}
                      </div>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Studies Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Active Studies</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studies.map(study => {
                      const studyParticipants = participants.filter(p => p.studyId._id === study._id);
                      const enrolled = studyParticipants.filter(p => p.status === 'Enrolled').length;
                      const progress = studyParticipants.length > 0 ? Math.round((enrolled / studyParticipants.length) * 100) : 0;
                      
                      return (
                        <tr key={study._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.protocolId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{studyParticipants.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrolled}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                              </div>
                              <span className="text-xs">{progress}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Participants</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map(participant => {
                    const nextStatus = getNextStatus(participant.status);
                    return (
                        <tr key={participant._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedParticipant(participant._id)}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {participant.firstName} {participant.lastName}
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.email || participant.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.studyId?.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                            {participant.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {nextStatus && (
                            <button
                              onClick={() => updateParticipantStatus(participant._id, nextStatus)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Move to {nextStatus}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Participant Workflow Management</h3>
            
            {/* Workflow Stages */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {['Potential', 'Screening', 'Enrolled', 'Disqualified', 'Withdrawn'].map((status, index) => {
                const statusParticipants = participants.filter(p => p.status === status);
                return (
                  <div key={status} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">{status}</h4>
                    <div className="space-y-2">
                      {statusParticipants.map(participant => (
                        <div key={participant._id} className="bg-white p-3 rounded border cursor-pointer hover:shadow-md" onClick={() => setSelectedParticipant(participant._id)}>
                          <p className="text-sm font-medium text-gray-900">
                            {participant.firstName} {participant.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{participant.studyId?.title}</p>
                          {getNextStatus(participant.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateParticipantStatus(participant._id, getNextStatus(participant.status));
                              }}
                              className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                            >
                              Move to {getNextStatus(participant.status)}
                            </button>
                          )}
                        </div>
                      ))}
                      {statusParticipants.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No participants</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Add New Participant
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Bulk Status Update
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role-based Participant View Modal */}
      {selectedParticipant && (
        <RoleBasedParticipantView
          participantId={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </div>
  );
};

export default SiteDashboard;
