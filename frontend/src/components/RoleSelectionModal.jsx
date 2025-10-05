import { useState, useEffect } from 'react';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Select Your Role
            </h2>
            <p className="text-slate-600">
              Choose your role to get a personalized proposal
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleRoleSelect('sponsor')}
              className="w-full p-6 text-left border-2 border-slate-200 rounded-xl hover:border-[#16B1F0] hover:bg-[#16B1F0]/5 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#16B1F0]/10 rounded-lg flex items-center justify-center group-hover:bg-[#16B1F0]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#16B1F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#16B1F0] transition-colors">
                    Sponsor / CRO
                  </h3>
                  <p className="text-sm text-slate-600">
                    Accelerate your clinical trial enrollment
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('site')}
              className="w-full p-6 text-left border-2 border-slate-200 rounded-xl hover:border-[#56F0C8] hover:bg-[#56F0C8]/5 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#56F0C8]/10 rounded-lg flex items-center justify-center group-hover:bg-[#56F0C8]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#56F0C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#56F0C8] transition-colors">
                    Site / Vendor
                  </h3>
                  <p className="text-sm text-slate-600">
                    Enhance your site's recruitment capabilities
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
