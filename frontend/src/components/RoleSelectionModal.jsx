import { useState, useEffect } from 'react';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState('');

  // Lock body scroll when modal is open and handle ESC key
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Handle ESC key press
      const handleEscKey = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      
      // Prevent touch events on background
      const preventTouch = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('touchmove', preventTouch, { passive: false });
      document.addEventListener('touchstart', preventTouch, { passive: false });
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.removeEventListener('touchmove', preventTouch);
        document.removeEventListener('touchstart', preventTouch);
      };
    } else {
      // Restore scrolling
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    };
  }, [isOpen, onClose]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      style={{ touchAction: 'none' }}
    >
      {/* Disable navbar and all page interactions */}
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40" style={{ touchAction: 'none' }} />
      
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative z-50"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'auto' }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-2">
            Select Your Organization
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
