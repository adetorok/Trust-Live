import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

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
                to="/about" 
                className="bg-white text-teal-600 border border-teal-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-teal-50 transition"
              >
                About Us
              </Link>
              <Link 
                to="/sponsor" 
                className="bg-white text-teal-600 border border-teal-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-teal-50 transition"
              >
                Sponsor / CRO
              </Link>
              <Link 
                to="/site" 
                className="bg-white text-teal-600 border border-teal-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-teal-50 transition"
              >
                Sites / Vendors
              </Link>
              <Link 
                to="/#contact" 
                className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-teal-700 transition"
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

