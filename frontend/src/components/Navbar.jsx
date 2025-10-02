import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

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
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-teal-700">
              TRACS
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              <a 
                href="/#services" 
                className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Our Difference
              </a>
              <Link 
                to="/" 
                className={getButtonStyles('/')}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={getButtonStyles('/about')}
              >
                About Us
              </Link>
              <Link 
                to="/sponsor" 
                className={getButtonStyles('/sponsor')}
              >
                Sponsor / CRO
              </Link>
              <Link 
                to="/site" 
                className={getButtonStyles('/site')}
              >
                Sites / Vendors
              </Link>
              <Link 
                to="/#contact" 
                className={getButtonStyles('/#contact', true)}
              >
                Request Proposal
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

