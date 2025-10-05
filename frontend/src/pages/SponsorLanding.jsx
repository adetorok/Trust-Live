import { useState, useEffect } from 'react';
import RoleSelectionModal from '../components/RoleSelectionModal';

const SponsorLanding = () => {
  const [showForm, setShowForm] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [formType, setFormType] = useState('sponsor');

  const handleRequestProposalClick = (e) => {
    e.preventDefault();
    // Directly open the form for Sponsor flow (no modal)
    setShowRoleModal(false);
    setFormType('sponsor');
    setShowForm(true);
    setSuccessEmail('');
    setTimeout(() => {
      const formElement = document.getElementById('contact-form-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleRoleSelect = (role) => {
    setShowRoleModal(false);
    setFormType(role);
    setShowForm(true);
    setSuccessEmail('');
    setTimeout(() => {
      const formElement = document.getElementById('contact-form-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('Contact form section not found');
      }
    }, 300);
  };

  const handleFormSuccess = (email) => {
    setSuccessEmail(email);
    setShowForm(false);
  };

  // Expose a helper so navbar can open this page's form immediately
  if (typeof window !== 'undefined') {
    window.__trustOpenSponsorForm = () => {
      setFormType('sponsor');
      setShowForm(true);
      setSuccessEmail('');
      setTimeout(() => {
        const el = document.getElementById('contact-form-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    };
  }

  // When navigated here from navbar selection, auto-open form
  useEffect(() => {
    try {
      const pending = localStorage.getItem('pendingRole');
      if (pending === 'sponsor') {
        localStorage.removeItem('pendingRole');
        window.__trustOpenSponsorForm();
      }
    } catch {}
  }, []);

  return (
    <div className="text-slate-800">
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelect={handleRoleSelect}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-blue-50 py-12 sm:py-16 lg:py-20">
        {/* Full hero background icon */}
        <img
          src={`${import.meta.env.BASE_URL}Trust icon.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[4] -translate-x-[8%]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Sponsor & CRO Solutions
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Accelerate your clinical trial enrollment with our proven patient recruitment strategies designed specifically for sponsors and CROs.
          </p>
          <div className="mt-2">
            <button
              onClick={handleRequestProposalClick}
              className="bg-[#16B1F0] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg text-center"
            >
              Request Your Proposal
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Why Sponsors Choose TRACS
            </h2>
            <p className="text-xl text-slate-600">
              Proven results that accelerate your study timeline and reduce costs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="text-4xl font-bold text-teal-600 mb-2">3x</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">Higher Enrollment</div>
              <div className="text-slate-600">Compared to traditional recruitment methods</div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="text-4xl font-bold text-teal-600 mb-2">50%</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">Fewer Screen Failures</div>
              <div className="text-slate-600">Thanks to nurse pre-screening</div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">Project Management</div>
              <div className="text-slate-600">Dedicated support throughout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Our Services for Sponsors
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive recruitment solutions tailored to your study needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Marketing & Materials</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Custom promotional materials</li>
                <li>• Professional flyers & brochures</li>
                <li>• Study-specific folders & handouts</li>
                <li>• Branded recruitment materials</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Digital Presence</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Custom landing page websites</li>
                <li>• Interest capture forms</li>
                <li>• Referral tracking systems</li>
                <li>• Mobile-optimized design</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Community Outreach</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• High-traffic location visits</li>
                <li>• Major landmark engagement</li>
                <li>• Community event participation</li>
                <li>• Direct patient engagement</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Clinical Support</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Licensed nurse pre-screening</li>
                <li>• Eligibility verification</li>
                <li>• Dedicated project manager</li>
                <li>• KPI monitoring & reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form-section" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600">
              Request a personalized proposal for your study
            </p>
          </div>

          {successEmail ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700 text-lg">
                We've sent a verification email to <strong>{successEmail}</strong>
              </p>
              <p className="text-green-600 mt-2">
                Please check your email and click the link to access your personalized proposal.
              </p>
            </div>
          ) : showForm ? (
            <div className="bg-slate-50 rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Sponsor / CRO Proposal Request
                </h3>
                <p className="text-slate-600">
                  Tell us about your study and we'll create a customized proposal
                </p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Company Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Your company name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="studyDetails" className="block text-sm font-medium text-slate-700 mb-2">
                    Study Details (Optional)
                  </label>
                  <textarea
                    id="studyDetails"
                    name="studyDetails"
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Tell us about your study, timeline, or specific requirements..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-bold py-4 rounded-lg hover:bg-teal-700 transition-colors text-lg"
                >
                  Request My Proposal
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-slate-600 mb-8">
                Ready to accelerate your study enrollment?
              </p>
              <button
                onClick={handleRequestProposalClick}
                className="bg-[#16B1F0] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg text-center"
              >
                Request Your Proposal
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SponsorLanding;
