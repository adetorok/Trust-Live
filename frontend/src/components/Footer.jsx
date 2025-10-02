import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Contact Info */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">TRACS</h4>
            <p className="text-slate-400 text-sm">
              123 University Heights Dr<br />
              Newark, NJ 07102<br />
              United States
            </p>
            <p className="text-slate-400 text-sm mt-4">
              P: (973) 555-1234<br />
              E: <a href="mailto:contact@tracs-recruitment.com" className="hover:text-teal-400">
                contact@tracs-recruitment.com
              </a>
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-400 hover:text-white text-sm">Home</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white text-sm">About Us</Link></li>
              <li><a href="/#services" className="text-slate-400 hover:text-white text-sm">Our Difference</a></li>
              <li><a href="/#contact" className="text-slate-400 hover:text-white text-sm">Request Proposal</a></li>
              <li><Link to="/sponsor" className="text-slate-400 hover:text-white text-sm">Sponsor / CRO</Link></li>
              <li><Link to="/site" className="text-slate-400 hover:text-white text-sm">Sites / Vendors</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Core Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Core Services</h4>
            <ul className="space-y-2">
              <li className="text-slate-400 text-sm">Community Outreach</li>
              <li className="text-slate-400 text-sm">Nurse-Led Pre-Screening</li>
              <li className="text-slate-400 text-sm">IRB & Documentation Support</li>
              <li className="text-slate-400 text-sm">Full Project Management</li>
            </ul>
          </div>
          
          {/* Column 4: Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white" aria-label="X/Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.617l-5.21-6.817-6.045 6.817h-3.308l7.73-8.805-7.994-10.69h6.797l4.632 6.226 5.43-6.226zm-2.4 17.338h1.867l-9.497-12.66h-2.13l9.76 12.66z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
          <p>
            &copy; 2025 TRACS - Trial Recruitment and Clinical Services. All Rights Reserved. 
            <span className="mx-2">|</span> 
            <a href="#" className="hover:text-white">Privacy Policy</a> 
            <span className="mx-2">|</span> 
            <a href="#" className="hover:text-white">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

