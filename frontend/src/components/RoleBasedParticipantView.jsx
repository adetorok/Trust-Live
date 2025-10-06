import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import ParticipantHeader from './ParticipantHeader';
import StatusStrip from './StatusStrip';
import FileUpload from './FileUpload';
import FileList from './FileList';

const RoleBasedParticipantView = ({ participantId, onClose }) => {
  const { user } = useAuth();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadParticipant();
  }, [participantId]);

  const loadParticipant = async () => {
    try {
      setLoading(true);
      const view = user.role === 'admin' ? 'admin' : user.role === 'sponsor' ? 'sponsor' : 'site';
      const response = await api.get(`/participants/${participantId}?view=${view}`);
      setParticipant(response.participant);
      
      // Load activities/notes
      loadActivities();
    } catch (error) {
      console.error('Failed to load participant:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      // Mock activities for now - in real app, this would be an API call
      const mockActivities = [
        {
          id: 1,
          type: 'status_update',
          message: `Status changed to ${participant?.status}`,
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

  const handleStatusChange = async (participantId, newStatus) => {
    try {
      await api.post(`/participants/${participantId}/transition`, { to: newStatus });
      loadParticipant(); // Refresh data
    } catch (error) {
      console.error('Failed to update participant status:', error);
    }
  };

  const addNote = async () => {
    if (!notes.trim()) return;
    
    try {
      await api.post(`/participants/${participantId}/notes`, { content: notes });
      setNotes('');
      loadActivities(); // Refresh activities
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const getTabsForRole = () => {
    const baseTabs = ['profile'];
    
    switch (user.role) {
      case 'site':
        return [...baseTabs, 'messages', 'screeners', 'visits', 'files', 'activity'];
      case 'sponsor':
        return [...baseTabs, 'quality', 'throughput', 'files', 'activity'];
      case 'admin':
        return [...baseTabs, 'integrations', 'files', 'audit', 'security'];
      default:
        return baseTabs;
    }
  };

  const renderTabContent = () => {
    if (!participant) return null;

    switch (activeTab) {
      case 'profile':
        return <ProfileTab participant={participant} userRole={user.role} />;
      case 'messages':
        return <MessagesTab participant={participant} userRole={user.role} />;
      case 'screeners':
        return <ScreenersTab participant={participant} userRole={user.role} />;
      case 'visits':
        return <VisitsTab participant={participant} userRole={user.role} />;
      case 'files':
        return <FilesTab participant={participant} userRole={user.role} />;
      case 'activity':
        return <ActivityTab participant={participant} userRole={user.role} activities={activities} notes={notes} onAddNote={addNote} setNotes={setNotes} />;
      case 'quality':
        return <QualityTab participant={participant} userRole={user.role} />;
      case 'throughput':
        return <ThroughputTab participant={participant} userRole={user.role} />;
      case 'integrations':
        return <IntegrationsTab participant={participant} userRole={user.role} />;
      case 'audit':
        return <AuditTab participant={participant} userRole={user.role} />;
      case 'security':
        return <SecurityTab participant={participant} userRole={user.role} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-lg font-medium text-gray-700">Loading participant...</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-lg font-medium text-gray-700">Participant not found</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Participant Details</h2>
            <p className="text-sm text-gray-600">{participant.study.title} - {participant.site.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Status Strip */}
        <StatusStrip 
          participant={participant} 
          userRole={user.role}
          onStatusChange={handleStatusChange}
          readOnly={!participant.canTransition}
        />

        {/* Participant Header */}
        <ParticipantHeader 
          participant={participant} 
          userRole={user.role}
          onEdit={(type) => console.log('Edit:', type)}
        />

        <div className="flex h-[calc(90vh-300px)]">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {getTabsForRole().map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-400px)]">
              {renderTabContent()}
            </div>
          </div>

          {/* Sidebar for site users */}
          {user.role === 'site' && (
            <div className="w-80 bg-gray-50 border-l p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">CONTACT DETAILS</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <p className="text-sm text-gray-900">{participant.name.first}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <p className="text-sm text-gray-900">{participant.name.last}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{participant.contact.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{participant.contact.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const ProfileTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Study</label>
        <p className="mt-1 text-sm text-gray-900">{participant.study.title}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Protocol ID</label>
        <p className="mt-1 text-sm text-gray-900">{participant.study.protocolId}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Site</label>
        <p className="mt-1 text-sm text-gray-900">{participant.site.name}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {participant.status}
        </span>
      </div>
    </div>
  </div>
);

const MessagesTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Messages</h3>
    <p className="text-gray-600">Message functionality would be implemented here.</p>
  </div>
);

const ScreenersTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Screeners</h3>
    <p className="text-gray-600">Screener forms and results would be displayed here.</p>
  </div>
);

const VisitsTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Visits</h3>
    <p className="text-gray-600">Visit schedule and history would be displayed here.</p>
  </div>
);

const FilesTab = ({ participant, userRole }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadSuccess = (data) => {
    console.log('Files uploaded successfully:', data);
    setShowUpload(false);
    // Refresh file list would be handled by parent component
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    alert(error);
  };

  const handleFileDelete = (fileId) => {
    console.log('File deleted:', fileId);
    // Refresh file list would be handled by parent component
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Files</h3>
        {userRole !== 'sponsor' && (
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showUpload ? 'Cancel Upload' : 'Upload Files'}
          </button>
        )}
      </div>

      {showUpload && userRole !== 'sponsor' && (
        <div className="border border-gray-200 rounded-lg p-6">
          <FileUpload
            entityType="Participant"
            entityId={participant.id}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            multiple={true}
            fileTypes={['document', 'consent', 'screening', 'other']}
          />
        </div>
      )}

      <FileList
        entityType="Participant"
        entityId={participant.id}
        onFileDelete={handleFileDelete}
        canDelete={userRole !== 'sponsor'}
        canDownload={userRole !== 'sponsor'}
      />
    </div>
  );
};

const ActivityTab = ({ participant, userRole, activities, notes, onAddNote, setNotes }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Activity</h3>
    
    {/* Add Note */}
    {userRole === 'site' && (
      <div className="mb-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter a note..."
          className="w-full p-3 border border-gray-300 rounded-md resize-none"
          rows="3"
        />
        <button
          onClick={onAddNote}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Add Note
        </button>
      </div>
    )}

    {/* Activity List */}
    <div className="space-y-3">
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
);

const QualityTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Quality Metrics</h3>
    <p className="text-gray-600">Quality metrics and screener results would be displayed here.</p>
  </div>
);

const ThroughputTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Throughput Metrics</h3>
    <p className="text-gray-600">Throughput and timeline metrics would be displayed here.</p>
  </div>
);

const IntegrationsTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
    <p className="text-gray-600">Integration details and webhook information would be displayed here.</p>
  </div>
);

const AuditTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Audit Trail</h3>
    <p className="text-gray-600">Full audit trail would be displayed here.</p>
  </div>
);

const SecurityTab = ({ participant, userRole }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Security</h3>
    <p className="text-gray-600">Security logs and access information would be displayed here.</p>
  </div>
);

export default RoleBasedParticipantView;
