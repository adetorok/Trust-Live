import { useState } from 'react';
import RoleSelectionModal from '../components/RoleSelectionModal';

const About = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('sponsor');
  const [successEmail, setSuccessEmail] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleRequestProposalClick = (e) => {
    e.preventDefault();
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role) => {
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
            About TRUST
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            TRUST recruits qualified subjects so sites and sponsors hit enrollment targets—fast and predictably. We combine community outreach and nurse-led pre-screening to reduce screen fails and coordinator burden.
          </p>
          <div className="mt-2">
            <button
              onClick={handleRequestProposalClick}
              className="bg-[#16B1F0] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg"
            >
              Request Your Proposal
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-700 mb-6">
                TRUST's primary objective is enrollment. We deliver qualified, pre-screened subjects so your site meets accrual targets on time. We achieve this through targeted community outreach and nurse-led pre-screening that reduce screen fails and coordinator workload.
              </p>
              <p className="text-lg text-slate-700 mb-8">
                IRB-ready bilingual (EN/ES) materials and HIPAA-aware processes support compliance while keeping recruitment moving.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#56F0C8] rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#0B1220] font-bold">✓</span>
                  </div>
                  <span className="text-slate-700 font-medium">Meet or exceed enrollment targets for the contracted study(ies)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#56F0C8] rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#0B1220] font-bold">✓</span>
                  </div>
                  <span className="text-slate-700 font-medium">Improve referral quality via nurse-led inclusion/exclusion pre-screening</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#56F0C8] rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#0B1220] font-bold">✓</span>
                  </div>
                  <span className="text-slate-700 font-medium">Lower site burden by shifting outreach and pre-screen to TRUST</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#56F0C8] rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#0B1220] font-bold">✓</span>
                  </div>
                  <span className="text-slate-700 font-medium">Maintain compliance (IRB/ICH-GCP aligned; HIPAA-aware) without slowing recruitment</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#56F0C8]/10 to-[#16B1F0]/10 p-8 rounded-2xl border border-[#56F0C8]/20">
              <h3 className="text-2xl font-bold text-[#0B1220] mb-4">Why Choose TRUST?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#16B1F0] font-bold mr-3">•</span>
                  <span className="text-[#10224E]">Qualified, pre-screened participants</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16B1F0] font-bold mr-3">•</span>
                  <span className="text-[#10224E]">Compliant, IRB-ready bilingual materials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16B1F0] font-bold mr-3">•</span>
                  <span className="text-[#10224E]">Nurse-led pre-screening reduces screen failures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16B1F0] font-bold mr-3">•</span>
                  <span className="text-[#10224E]">Predictable enrollment timelines</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Our Team
            </h2>
            <p className="text-xl text-slate-600">
              Experienced professionals dedicated to your study's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👩‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Clinical Nurses</h3>
              <p className="text-slate-600">
                Licensed professionals who pre-screen every potential participant to ensure study eligibility and reduce screen failures.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Community Outreach</h3>
              <p className="text-slate-600">
                Specialists who engage directly with communities, building trust and identifying genuinely interested participants.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Project Managers</h3>
              <p className="text-slate-600">
                Dedicated professionals who coordinate every aspect of your recruitment campaign and ensure KPIs are met.
              </p>
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
                  {formType === 'sponsor' ? 'Sponsor / CRO Proposal Request' : 'Site / Vendor Proposal Request'}
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
                Choose your role to get started with a personalized proposal
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleRequestProposalClick}
                  className="bg-[#16B1F0] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg"
                >
                  Request Proposal
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
