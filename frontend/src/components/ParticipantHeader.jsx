import React from 'react';

const ParticipantHeader = ({ participant, userRole, onEdit }) => {
  const renderContactInfo = () => {
    switch (userRole) {
      case 'site':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Phone:</span>
              <a 
                href={`tel:${participant.contact.phone}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {participant.contact.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <a 
                href={`mailto:${participant.contact.email}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {participant.contact.email}
              </a>
            </div>
          </div>
        );

      case 'sponsor':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Phone:</span>
              <span className="text-gray-800 font-mono">
                {participant.contact.phoneMasked}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <span className="text-gray-800 font-mono">
                {participant.contact.emailMasked}
              </span>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Phone:</span>
              <a 
                href={`tel:${participant.pii.phone}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {participant.pii.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <a 
                href={`mailto:${participant.pii.email}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {participant.pii.email}
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderName = () => {
    switch (userRole) {
      case 'site':
        return (
          <h2 className="text-2xl font-bold text-gray-900">
            {participant.name.first} {participant.name.last}
          </h2>
        );

      case 'sponsor':
        return (
          <h2 className="text-2xl font-bold text-gray-900">
            {participant.name.display}
          </h2>
        );

      case 'admin':
        return (
          <h2 className="text-2xl font-bold text-gray-900">
            {participant.pii.firstName} {participant.pii.lastName}
          </h2>
        );

      default:
        return null;
    }
  };

  const renderStudySiteChips = () => {
    return (
      <div className="flex space-x-2 mt-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {participant.study.title}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {participant.site.name}
        </span>
        {userRole === 'admin' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {participant.study.protocolId}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {renderName()}
          {renderStudySiteChips()}
          <div className="mt-4">
            {renderContactInfo()}
          </div>
        </div>

        {/* Action buttons based on role */}
        <div className="flex space-x-2">
          {userRole === 'site' && participant.canEdit && (
            <button
              onClick={() => onEdit && onEdit('contact')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              Edit Contact
            </button>
          )}
          
          {userRole === 'admin' && (
            <button
              onClick={() => onEdit && onEdit('admin')}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 border border-purple-300 rounded-md hover:bg-purple-50"
            >
              Admin Override
            </button>
          )}

          {userRole === 'sponsor' && (
            <button
              onClick={() => onEdit && onEdit('comment')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Comment to Site
            </button>
          )}
        </div>
      </div>

      {/* Additional info for different roles */}
      {userRole === 'sponsor' && participant.quality && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              Screener Pass Likely: 
              <span className={`ml-1 font-medium ${participant.quality.screenerPassLikely ? 'text-green-600' : 'text-red-600'}`}>
                {participant.quality.screenerPassLikely ? 'Yes' : 'No'}
              </span>
            </span>
            {participant.consent && (
              <span className="text-gray-600">
                Consent Received: 
                <span className={`ml-1 font-medium ${participant.consent.received ? 'text-green-600' : 'text-red-600'}`}>
                  {participant.consent.received ? 'Yes' : 'No'}
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {userRole === 'admin' && participant.integrations && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Source:</span> {participant.integrations.source} | 
            <span className="font-medium ml-2">ID:</span> {participant.integrations.idempotencyKey}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantHeader;
