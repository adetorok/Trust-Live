import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ParticipantDetail = ({ participant, onClose, onStatusUpdate }) => {
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadActivities();
  }, [participant]);

  const loadActivities = async () => {
    try {
      // Mock activities for now - in real app, this would be an API call
      const mockActivities = [
        {
          id: 1,
          type: 'status_update',
          message: `Status changed to ${participant.status}`,
          timestamp: new Date().toISOString(),
          user: 'Site Coordinator'
        },
        {
          id: 2,
          type: 'note',
          message: 'Initial contact made via phone',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          user: 'Site Coordinator'
        }
      ];
      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const addNote = async () => {
    if (!notes.trim()) return;
    
    try {
      // In real app, this would be an API call
      const newActivity = {
        id: Date.now(),
        type: 'note',
        message: notes,
        timestamp: new Date().toISOString(),
        user: 'Site Coordinator'
      };
      setActivities([newActivity, ...activities]);
      setNotes('');
    } catch (error) {
      console.error('Failed to add note:', error);
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

  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate(participant._id, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{participant.firstName} {participant.lastName}</h2>
            <p className="text-sm text-gray-600">{participant.studyId?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Status Banner */}
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4">
          <div className="flex items-center">
            <span className="text-orange-800 font-semibold">
              STATUS Recruitment: {participant.status}
            </span>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Contact Information */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{participant.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{participant.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Study ID</label>
                  <p className="mt-1 text-sm text-gray-900">{participant.studyId?.protocolId || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Participant ID</label>
                  <p className="mt-1 text-sm text-gray-900">{participant._id.slice(-8)}</p>
                </div>
              </div>
            </div>

            {/* Status Workflow */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participant Workflow</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    participant.status === 'Potential' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  In Potential Participant
                </button>
                {participant.status === 'Potential' && (
                  <button
                    onClick={() => handleStatusUpdate('Screening')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                  >
                    📋 Move to Screening
                  </button>
                )}
                {participant.status === 'Screening' && (
                  <button
                    onClick={() => handleStatusUpdate('Enrolled')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                  >
                    👤 Move to Enrolled
                  </button>
                )}
                {participant.status === 'Enrolled' && (
                  <button
                    onClick={() => handleStatusUpdate('Completed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                  >
                    ✅ Mark as Completed
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate('Disqualified')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center"
                >
                  ❌ Disqualified
                </button>
                <button
                  onClick={() => handleStatusUpdate('Withdrawn')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 flex items-center"
                >
                  🚪 Withdraw
                </button>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
              
              {/* Add Note */}
              <div className="mb-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter a note..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows="3"
                />
                <button
                  onClick={addNote}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>

              {/* Activity Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8">
                  {['All', 'Notes', 'Status Updates'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`${
                        activeTab === tab.toLowerCase()
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Activity List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-l p-6">
            <div className="space-y-6">
              {/* Contact Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">CONTACT DETAILS</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="text-sm text-gray-900">{participant.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="text-sm text-gray-900">{participant.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{participant.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{participant.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Study Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">STUDY INFORMATION</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Study Title</label>
                    <p className="text-sm text-gray-900">{participant.studyId?.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Protocol ID</label>
                    <p className="text-sm text-gray-900">{participant.studyId?.protocolId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site</label>
                    <p className="text-sm text-gray-900">{participant.siteId?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                      {participant.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetail;
