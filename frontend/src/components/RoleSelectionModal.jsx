import { useState, useEffect } from 'react';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState('');

  // Lock scroll (html + body) and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;

    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'contain';
    document.body.style.overscrollBehavior = 'contain';

    const handleEscKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      role="dialog"
      aria-modal="true"
    >
      {/* Dim page and block interaction */}
      <div className="fixed inset-0 bg-black/20 z-[90]" />
      
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto p-8 relative z-[110]"
        onClick={(e) => e.stopPropagation()}
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
