import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        ? `${baseStyles} bg-teal-700 text-white` 
        : `${baseStyles} bg-teal-100 text-teal-800 border-2 border-teal-600`;
    }
    
    return isPrimary
      ? `${baseStyles} bg-teal-600 text-white hover:bg-teal-700`
      : `${baseStyles} bg-white text-teal-600 border border-teal-600 hover:bg-teal-50`;
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50" role="banner">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-xl font-bold text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="TRACS - Go to homepage"
            >
              TRACS
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2" role="menubar">
              <a 
                href="/#services" 
                className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  const servicesElement = document.getElementById('services');
                  if (servicesElement) {
                    servicesElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                role="menuitem"
                aria-label="Scroll to Our Difference section"
              >
                Our Difference
              </a>
              <Link 
                to="/" 
                className={`${getButtonStyles('/')} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                role="menuitem"
                aria-label="Go to Home page"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`${getButtonStyles('/about')} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                role="menuitem"
                aria-label="Go to About Us page"
              >
                About Us
              </Link>
              <Link 
                to="/sponsor" 
                className={`${getButtonStyles('/sponsor')} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                role="menuitem"
                aria-label="Go to Sponsor / CRO page"
              >
                Sponsor / CRO
              </Link>
              <Link 
                to="/site" 
                className={`${getButtonStyles('/site')} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                role="menuitem"
                aria-label="Go to Sites / Vendors page"
              >
                Sites / Vendors
              </Link>
              <Link 
                to="/#contact" 
                className={`${getButtonStyles('/#contact', true)} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                role="menuitem"
                aria-label="Request a proposal"
              >
                Request Proposal
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
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
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu" role="menu" aria-label="Mobile navigation">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
            <a 
              href="/#services" 
              className="text-slate-600 hover:text-slate-900 block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                const servicesElement = document.getElementById('services');
                if (servicesElement) {
                  servicesElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              role="menuitem"
              aria-label="Scroll to Our Difference section"
            >
              Our Difference
            </a>
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${isActive('/') ? 'bg-teal-100 text-teal-800' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
              aria-label="Go to Home page"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${isActive('/about') ? 'bg-teal-100 text-teal-800' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
              aria-label="Go to About Us page"
            >
              About Us
            </Link>
            <Link 
              to="/sponsor" 
              className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${isActive('/sponsor') ? 'bg-teal-100 text-teal-800' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
              aria-label="Go to Sponsor / CRO page"
            >
              Sponsor / CRO
            </Link>
            <Link 
              to="/site" 
              className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${isActive('/site') ? 'bg-teal-100 text-teal-800' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
              aria-label="Go to Sites / Vendors page"
            >
              Sites / Vendors
            </Link>
            <Link 
              to="/#contact" 
              className="block px-3 py-2 rounded-md text-base font-medium bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                const contactElement = document.getElementById('contact');
                if (contactElement) {
                  contactElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              role="menuitem"
              aria-label="Request a proposal"
            >
              Request Proposal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

