import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import RoleSelectionModal from './RoleSelectionModal';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleRequestProposalClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu when opening role modal
    setShowRoleModal(true);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu when opening role modal
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role) => {
    setShowRoleModal(false);
    // Navigate to home page and trigger form opening
    window.location.hash = '#/';
    setTimeout(() => {
      if (role === 'sponsor' && typeof window.__trustOpenSponsorForm === 'function') {
        window.__trustOpenSponsorForm();
      } else if (role === 'site' && typeof window.__trustOpenSiteForm === 'function') {
        window.__trustOpenSiteForm();
      }
    }, 100);
  };

  const handleNavClick = (path) => {
    // Scroll to top when clicking on any nav link
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  // Helper function to check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path;
  };

  // Helper function to get button styles based on active state
  const getButtonStyles = (path, isPrimary = false) => {
    const baseStyles = "px-4 py-2 rounded-md text-sm font-bold transition";
    
    if (isActive(path)) {
      return isPrimary 
        ? `${baseStyles} bg-[#10224E] text-[#E8EEFC]` 
        : `${baseStyles} bg-[#56F0C8] text-[#0B1220] border-2 border-[#56F0C8]`;
    }
    
    return isPrimary
      ? `${baseStyles} bg-[#16B1F0] text-white hover:bg-[#10224E]`
      : `${baseStyles} bg-white text-[#10224E] border border-[#10224E] hover:bg-[#56F0C8] hover:text-[#0B1220]`;
  };

  return (
    <>
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelect={handleRoleSelect}
      />
      <header className={`bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 ${showRoleModal ? 'pointer-events-none opacity-50' : ''}`} role="banner">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between h-24">
                <div className="flex-shrink-0">
                  <Link 
                    to="/" 
                    className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2 rounded-md px-2 py-1"
                    aria-label="TRUST - Go to homepage"
                  >
                    <img 
                      src={`${import.meta.env.BASE_URL}cg.png`} 
                      alt="TRUST Logo" 
                      className="h-16 w-auto object-contain"
                    />
                  </Link>
                </div>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2" role="menubar">
              <Link 
                to="/" 
                onClick={() => handleNavClick('/')}
                className={`${getButtonStyles('/')} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
                role="menuitem"
                aria-label="Go to Home page"
              >
                Home
              </Link>
              <div className="relative group">
                <button
                  className={`${getButtonStyles('/services')} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2 flex items-center`}
                  aria-label="Our Services dropdown"
                >
                  Our Services
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/services"
                      onClick={() => handleNavClick('/services')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      All Services
                    </Link>
                    <Link
                      to="/sponsor"
                      onClick={() => handleNavClick('/sponsor')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sponsor & CRO
                    </Link>
                    <Link
                      to="/site"
                      onClick={() => handleNavClick('/site')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Site & Vendor
                    </Link>
                  </div>
                </div>
              </div>
              <Link 
                to="/organization" 
                onClick={() => handleNavClick('/organization')}
                className={`${getButtonStyles('/organization')} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
                role="menuitem"
                aria-label="Go to Organization page"
              >
                Organization
              </Link>
              <Link 
                to="/faq" 
                onClick={() => handleNavClick('/faq')}
                className={`${getButtonStyles('/faq')} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
                role="menuitem"
                aria-label="Go to FAQ page"
              >
                FAQ
              </Link>
              <button
                onClick={handleRequestProposalClick}
                className={`${getButtonStyles('/#contact', true)} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
                role="menuitem"
                aria-label="Request a proposal"
              >
                Request Proposal
              </button>
              
              {/* Sign In / Sign Up Section */}
              <div className="ml-4 flex items-center space-x-2 border-l border-gray-300 pl-4">
                <Link
                  to="/admin/login"
                  className="px-3 py-2 text-sm font-medium text-[#10224E] hover:text-[#16B1F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2 rounded-md"
                  role="menuitem"
                  aria-label="Sign in to admin dashboard"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleSignUpClick}
                  className="px-4 py-2 text-sm font-bold text-white bg-[#16B1F0] rounded-md hover:bg-[#10224E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2"
                  role="menuitem"
                  aria-label="Sign up for access"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => !showRoleModal && setIsMobileMenuOpen(!isMobileMenuOpen)}
              disabled={showRoleModal}
              className={`inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 ${showRoleModal ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && !showRoleModal && (
        <div className="md:hidden" id="mobile-menu" role="menu" aria-label="Mobile navigation">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-[#56F0C8] text-[#0B1220]' : 'text-slate-600 hover:text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/');
              }}
              role="menuitem"
              aria-label="Go to Home page"
            >
              Home
            </Link>
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-semibold text-slate-600">
                Our Services
              </div>
              <Link 
                to="/services" 
                className={`block px-6 py-2 rounded-md text-sm font-medium ${isActive('/services') ? 'bg-[#56F0C8] text-[#0B1220]' : 'text-slate-600 hover:text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavClick('/services');
                }}
                role="menuitem"
                aria-label="Go to Our Services page"
              >
                All Services
              </Link>
              <Link 
                to="/sponsor" 
                className={`block px-6 py-2 rounded-md text-sm font-medium ${isActive('/sponsor') ? 'bg-[#56F0C8] text-[#0B1220]' : 'text-slate-600 hover:text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavClick('/sponsor');
                }}
                role="menuitem"
                aria-label="Go to Sponsor page"
              >
                Sponsor & CRO
              </Link>
              <Link 
                to="/site" 
                className={`block px-6 py-2 rounded-md text-sm font-medium ${isActive('/site') ? 'bg-[#56F0C8] text-[#0B1220]' : 'text-slate-600 hover:text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavClick('/site');
                }}
                role="menuitem"
                aria-label="Go to Site page"
              >
                Site & Vendor
              </Link>
            </div>
            <Link 
              to="/organization" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/organization') ? 'bg-[#56F0C8] text-[#0B1220]' : 'text-slate-600 hover:text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/organization');
              }}
              role="menuitem"
              aria-label="Go to Organization page"
            >
              Organization
            </Link>
            <Link 
              to="/faq" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/faq') ? 'bg-[#56F0C8] text-[#0B1220]' : 'text-slate-600 hover:text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/faq');
              }}
              role="menuitem"
              aria-label="Go to FAQ page"
            >
              FAQ
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                handleRequestProposalClick(e);
              }}
              className="block px-3 py-2 rounded-md text-base font-medium bg-[#16B1F0] text-white hover:bg-[#10224E] focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2"
              role="menuitem"
              aria-label="Request a proposal"
            >
              Request Proposal
            </button>
            
            {/* Mobile Sign In / Sign Up Section */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="space-y-2">
                <Link
                  to="/admin/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#10224E] hover:text-[#16B1F0] focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                  aria-label="Sign in to admin dashboard"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignUpClick({ preventDefault: () => {} });
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-[#16B1F0] text-white hover:bg-[#10224E] focus:outline-none focus:ring-2 focus:ring-[#56F0C8] focus:ring-offset-2"
                  role="menuitem"
                  aria-label="Sign up for access"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;
