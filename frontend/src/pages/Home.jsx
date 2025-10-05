import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoleSelectionModal from '../components/RoleSelectionModal';

const Home = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const contactFormRef = useRef(null);
  const [formType, setFormType] = useState(''); // 'sponsor' or 'site'
  const [showForm, setShowForm] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleRequestProposalClick = (e) => {
    e.preventDefault();
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role) => {
    setFormType(role);
    setShowForm(true);
    setSuccessEmail('');
    // Scroll to the form section with longer timeout to ensure rendering
    setTimeout(() => {
      const contactElement = document.getElementById('contact-form-section');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('Contact form section not found');
      }
    }, 300);
  };

  // Handle scroll to contact section when URL hash is #contact
  useEffect(() => {
    const handleHashChange = () => {
      const openFormFlag = sessionStorage.getItem('openContactForm');
      const pendingRole = sessionStorage.getItem('pendingRole');

      if (window.location.hash === '#contact-form-section' || openFormFlag === 'true') {
        setTimeout(() => {
          const contactElement = document.getElementById('contact-form-section');
          if (contactElement) {
            contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (pendingRole) {
              setFormType(pendingRole);
              setShowForm(true);
            }
          }
          sessionStorage.removeItem('openContactForm');
          sessionStorage.removeItem('pendingRole');
        }, 300); // Small delay to ensure element is rendered
      }
    };

    handleHashChange(); // Call on initial load
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
    setSuccessEmail('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.role = formType; // Add the selected role to the form data

    try {
      const response = await fetch(`/api/quotes/${formType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit proposal request.');
      }

      const result = await response.json();
      setSuccessEmail(data.email); // Store the email for the success message
      setShowForm(false); // Hide the form and show success message
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelect={handleRoleSelect}
      />
      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-br from-[#0B1220] to-[#10224E] py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Full hero background icon */}
        <img
          src={`${import.meta.env.BASE_URL}trust-icon.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[3.5]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:translate-x-[5%]">
            {/* Left side - Main content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#E8EEFC] leading-tight mb-6">
                Recruit Qualified Subjects—Fast & Predictable
              </h1>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-2xl mx-auto lg:mx-0">
                <div className="space-y-4 text-lg text-[#A4B0CC]">
                  <div className="flex items-start space-x-3">
                    <span className="text-[#56F0C8] text-xl mt-1">✓</span>
                    <p>TRUST builds a steady pipeline of pre-qualified subjects so your study meets enrollment targets.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-[#56F0C8] text-xl mt-1">✓</span>
                    <p>Our method blends targeted community outreach with nurse-led pre-screening to cut screen-fail rates and keep coordinators focused on visits.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-[#56F0C8] text-xl mt-1">✓</span>
                    <p>IRB-ready bilingual materials included.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Interactive Process Flow (Hover-only) */}
            <div className="flex flex-col space-y-3 max-w-lg mx-auto lg:translate-x-[10%]">
              {/* Step 1: Enrollment */}
              <div className="relative group p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#56F0C8] rounded-full flex items-center justify-center text-[#0B1220] font-bold text-sm">1</div>
                  <h3 className="text-xl font-semibold text-[#E8EEFC]">Enrollment Focused</h3>
                </div>
                <div className="absolute left-7 top-10 h-full border-l-2 border-dashed border-[#56F0C8] group-last:border-transparent"></div>
                <div className="mt-2 ml-12 text-sm text-[#A4B0CC] opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-in-out">
                  <p>Our primary focus is meeting your enrollment targets efficiently and effectively.</p>
                </div>
              </div>

              {/* Step 2: Materials & Marketing */}
              <div className="relative group p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#16B1F0] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <h3 className="text-xl font-semibold text-[#E8EEFC]">Materials & Marketing</h3>
                </div>
                <div className="absolute left-7 top-10 h-full border-l-2 border-dashed border-[#16B1F0] group-last:border-transparent"></div>
                <div className="mt-2 ml-12 text-sm text-[#A4B0CC] opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-in-out">
                  <p>IRB-approved flyers, brochures, landing pages, and online marketing to capture interest.</p>
                </div>
              </div>

              {/* Step 3: Strategy & Community Outreach */}
              <div className="relative group p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#10224E] rounded-full flex items-center justify-center text-[#E8EEFC] font-bold text-sm">3</div>
                  <h3 className="text-xl font-semibold text-[#E8EEFC]">Strategy & Community Outreach</h3>
                </div>
                <div className="absolute left-7 top-10 h-full border-l-2 border-dashed border-[#10224E] group-last:border-transparent"></div>
                <div className="mt-2 ml-12 text-sm text-[#A4B0CC] opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-in-out">
                  <p>Simultaneously identify communities and create strategies for primary outreach and engagement.</p>
                </div>
              </div>

              {/* Step 4: Nurse-led Screening */}
              <div className="relative group p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#56F0C8] rounded-full flex items-center justify-center text-[#0B1220] font-bold text-sm">4</div>
                  <h3 className="text-xl font-semibold text-[#E8EEFC]">Nurse-led Screening</h3>
                </div>
                <div className="absolute left-7 top-10 h-full border-l-2 border-dashed border-[#56F0C8] group-last:border-transparent"></div>
                <div className="mt-2 ml-12 text-sm text-[#A4B0CC] opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-in-out">
                  <p>Professional nurse pre-screening for eligibility verification, reducing screen-fail rates.</p>
                </div>
              </div>

              {/* Final Step: Eligible Subject */}
              <div className="relative group p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <h3 className="text-xl font-semibold text-[#E8EEFC]">Eligible Subject</h3>
                </div>
                <div className="mt-2 ml-12 text-sm text-[#A4B0CC] opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-in-out">
                  <p>Qualified, pre-screened subjects ready for enrollment, ensuring faster FPI and steady accrual.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={handleRequestProposalClick}
              className="bg-[#16B1F0] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg text-center"
            >
              Request Your Proposal
            </button>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section id="value-props" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-12">
            Our Value Propositions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value Prop 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#56F0C8]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Enrollment First</h3>
              <p className="text-slate-700">
                Our north star is meeting your enrollment plan—not just generating clicks or inquiries.
              </p>
            </div>
            {/* Value Prop 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#16B1F0]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#10224E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Over Volume</h3>
              <p className="text-slate-700">
                Nurse-led pre-screening delivers eligible, engaged referrals to your site.
              </p>
            </div>
            {/* Value Prop 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#10224E]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 15a1 1 0 001.447.921L18.553 9.079A1 1 0 0017.106 8l-3.906-1.302M3 6l7.89-3.684a1 1 0 011.226.165L21 12l-3.684 7.89a1 1 0 01-.165 1.226L6 21l-3-15z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Predictable Pipeline</h3>
              <p className="text-slate-700">
                Weekly outputs, transparent reporting, and fast iteration for steady accrual.
              </p>
            </div>
            {/* Value Prop 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#56F0C8]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 15v2m-2 0h4m-4 0H8m-2-5a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Coordinator Relief</h3>
              <p className="text-slate-700">
                We handle outreach and pre-screen so your team can run visits.
              </p>
            </div>
            {/* Value Prop 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#16B1F0]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#10224E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Compliant by Design</h3>
              <p className="text-slate-700">
                IRB-ready EN/ES materials and HIPAA-aware operations—without slowing recruitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section id="why-it-works" className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-12">
            Why TRUST Works
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6 text-lg text-slate-700">
                <p>
                  <strong>Online-only approach:</strong> low-intent clicks → no-shows → high screen-fail.
                </p>
                <p>
                  <strong>TRUST approach:</strong> in-person community outreach finds motivated candidates; nurse pre-screen filters for eligibility; sites receive ready-to-schedule referrals.
                </p>
                <p className="text-slate-700 font-semibold">
                  Result: faster FPI and steadier accrual.
                </p>
              </div>
            </div>
            <div className="relative h-80 w-full">
              <img
                src={`${import.meta.env.BASE_URL}why-trust-works.png`}
                alt="Collaborative group discussion showing community engagement and trust"
                className="rounded-xl shadow-lg object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent rounded-xl flex items-end p-6">
                <p className="text-white text-xl font-semibold">
                  Community collaboration drives enrollment success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="our-services" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Marketing */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#56F0C8]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Marketing</h3>
              <p className="text-slate-700">
                Custom promotional materials, flyers, brochures, folders, and landing page websites to draw members.
              </p>
            </div>
            {/* Service 2: Local Community Reachout */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#16B1F0]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#10224E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Local Community Reachout</h3>
              <p className="text-slate-700">
                "Boots on the ground," visiting major landmarks and high-traffic locations.
              </p>
            </div>
            {/* Service 3: Professional Landing Page */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#10224E]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Professional Landing Page</h3>
              <p className="text-slate-700">
                To capture interest and allow referrals.
              </p>
            </div>
            {/* Service 4: Nurse-led Screening */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#56F0C8]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Nurse-led Screening</h3>
              <p className="text-slate-700">
                To ensure subject eligibility.
              </p>
            </div>
            {/* Service 5: Dedicated Project Manager */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-[#16B1F0]/20 rounded-full mb-6">
                <svg className="h-8 w-8 text-[#10224E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.55 23.55 0 0112 15c-1.63 0-3.24-.182-4.81-.545m0 0A2.001 2.001 0 011.5 10.5V10a2 2 0 012-2h16a2 2 0 012 2v.5c0 1.11-.64 2.1-1.64 2.655M11 10V6a3 3 0 00-6 0v4m10 0v-4a3 3 0 00-6 0v4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dedicated Project Manager</h3>
              <p className="text-slate-700">
                To meet KPIs and commit to providing subjects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form-section" ref={contactFormRef} className="py-16 sm:py-20 bg-[#A4B0CC]/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1220] mb-4">
              Ready to Accelerate Your Recruitment?
            </h2>
            <p className="text-xl text-[#10224E]">
              Get a personalized proposal tailored to your specific needs and challenges.
            </p>
          </div>

          {!showForm ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#0B1220] mb-4">
                Ready to Accelerate Your Recruitment?
              </h3>
              <p className="text-lg text-[#10224E] mb-8">
                Select your role to get started with a personalized proposal.
              </p>
              <button
                onClick={handleRequestProposalClick}
                className="bg-[#16B1F0] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg"
              >
                Request Your Proposal
              </button>
            </div>
          ) : successEmail ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700 text-lg mb-4">
                Your proposal request has been successfully submitted.
              </p>
              <p className="text-green-600 text-base">
                A team member will get back to you shortly at <strong>{successEmail}</strong> with your personalized proposal.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Request Your Proposal
                </h3>
                <p className="text-slate-600">
                  Tell us about your organization and we'll create a customized proposal
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#56F0C8] focus:border-[#56F0C8]"
                      placeholder="John"
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#56F0C8] focus:border-[#56F0C8]"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#56F0C8] focus:border-[#56F0C8]"
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#56F0C8] focus:border-[#56F0C8]"
                    placeholder="Your Company Inc."
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
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#56F0C8] focus:border-[#56F0C8]"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#56F0C8] focus:border-[#56F0C8]"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="sponsor">Sponsor / CRO</option>
                    <option value="site">Site / Vendor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    How can we help you?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#56F0C8] focus:border-[#56F0C8]"
                    placeholder="Tell us about your recruitment needs..."
                  ></textarea>
                </div>
                
                {formError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#16B1F0] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#10224E] transition-colors shadow-md disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Request Your Proposal'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;