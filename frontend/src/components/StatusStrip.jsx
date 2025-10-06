import React from 'react';

const StatusStrip = ({ participant, userRole, onStatusChange, readOnly = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Enrolled': return 'bg-green-100 text-green-800 border-green-200';
      case 'Screening': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PendingConsent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Potential': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Disqualified': return 'bg-red-100 text-red-800 border-red-200';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Potential': return 'PendingConsent';
      case 'PendingConsent': return 'Screening';
      case 'Screening': return 'Enrolled';
      case 'Enrolled': return 'Completed';
      default: return null;
    }
  };

  const getStatusActions = (currentStatus) => {
    const actions = [];
    
    switch (currentStatus) {
      case 'Potential':
        actions.push({ label: 'Move to Pending Consent', status: 'PendingConsent', color: 'blue' });
        break;
      case 'PendingConsent':
        actions.push({ label: 'Move to Screening', status: 'Screening', color: 'yellow' });
        break;
      case 'Screening':
        actions.push({ label: 'Move to Enrolled', status: 'Enrolled', color: 'green' });
        actions.push({ label: 'Mark Disqualified', status: 'Disqualified', color: 'red' });
        break;
      case 'Enrolled':
        actions.push({ label: 'Mark Completed', status: 'Completed', color: 'green' });
        actions.push({ label: 'Mark Withdrawn', status: 'Withdrawn', color: 'gray' });
        break;
    }
    
    return actions;
  };

  const handleStatusChange = (newStatus) => {
    if (!readOnly && onStatusChange) {
      onStatusChange(participant.id, newStatus);
    }
  };

  const statusActions = getStatusActions(participant.status);
  const nextStatus = getNextStatus(participant.status);

  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-orange-800 font-semibold text-lg">
            STATUS Recruitment: {participant.status}
          </span>
          
          {/* Current Status Badge */}
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(participant.status)}`}>
            In {participant.status}
          </span>
        </div>

        {/* Action Buttons */}
        {!readOnly && statusActions.length > 0 && (
          <div className="flex space-x-2">
            {statusActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleStatusChange(action.status)}
                className={`px-4 py-2 text-sm font-medium rounded-md text-white hover:opacity-90 ${
                  action.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  action.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  action.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  action.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Read-only indicator for sponsors */}
        {readOnly && (
          <span className="text-orange-700 text-sm italic">
            Read-only view
          </span>
        )}
      </div>

      {/* KPIs for sponsors */}
      {userRole === 'sponsor' && participant.metrics && (
        <div className="mt-3 flex space-x-4 text-sm">
          <span className="text-orange-700">
            Days since inquiry: {participant.metrics.daysSinceInquiry}
          </span>
          <span className="text-orange-700">
            Time to first contact: {participant.metrics.timeToFirstContactHours}h
          </span>
          <span className="text-orange-700">
            Current stage age: {participant.metrics.currentStageAge || 'N/A'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusStrip;
