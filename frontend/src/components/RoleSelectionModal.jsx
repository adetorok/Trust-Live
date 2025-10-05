import { useState } from 'react';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-2">
            Select Your Role
          </h2>
          <p className="text-[#10224E]">
            Choose your organization type to get a personalized proposal
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('sponsor')}
            className="w-full p-6 bg-gradient-to-r from-[#16B1F0] to-[#10224E] text-white rounded-xl hover:from-[#10224E] hover:to-[#16B1F0] transition-all duration-300 shadow-lg"
          >
            <div className="text-left">
              <h3 className="text-xl font-bold mb-2">Sponsor / CRO</h3>
              <p className="text-sm opacity-90">
                Pharmaceutical companies, CROs, and biotech firms
              </p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('site')}
            className="w-full p-6 bg-gradient-to-r from-[#56F0C8] to-[#16B1F0] text-white rounded-xl hover:from-[#16B1F0] hover:to-[#56F0C8] transition-all duration-300 shadow-lg"
          >
            <div className="text-left">
              <h3 className="text-xl font-bold mb-2">Site / Vendor</h3>
              <p className="text-sm opacity-90">
                Research sites, hospitals, and clinical vendors
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 text-[#10224E] border border-[#10224E] rounded-lg hover:bg-[#56F0C8] hover:text-[#0B1220] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
