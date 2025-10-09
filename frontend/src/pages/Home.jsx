import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('sponsor');
  const [successEmail, setSuccessEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [enhancedFormType, setEnhancedFormType] = useState('sponsor');

  const beforeData = {
    labels: ['Unqualified Leads', 'Contacted but Lost', 'Enrolled'],
    datasets: [{
      label: 'Lead Outcomes',
      data: [85, 13, 2],
      backgroundColor: ['#fecaca', '#fca5a5', '#dc2626'],
      borderColor: '#f8fafc',
      borderWidth: 4,
    }]
  };

  const afterData = {
    labels: ['Unqualified Leads', 'Contacted but Lost', 'Enrolled'],
    datasets: [{
      label: 'Lead Outcomes',
      data: [30, 20, 50],
      backgroundColor: ['#a7f3d0', '#6ee7b7', '#10b981'],
      borderColor: '#f8fafc',
      borderWidth: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };


  const handleFormSuccess = (email) => {
    setSuccessEmail(email);
    setShowForm(false);
  };

  const handleRequestProposalClick = (e) => {
    e.preventDefault();
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role) => {
    setFormType(role);
    setEnhancedFormType(role);
    setShowEnhancedForm(true);
    setSuccessEmail('');
  };

  // Enhanced form handlers
  const handleOpenSponsorForm = () => {
    setEnhancedFormType('sponsor');
    setShowEnhancedForm(true);
  };

  const handleOpenSiteForm = () => {
    setEnhancedFormType('site');
    setShowEnhancedForm(true);
  };

  const handleEnhancedFormSuccess = () => {
    setSuccessEmail('Thank you for your proposal request! We will contact you soon.');
    setShowEnhancedForm(false);
    setShowForm(true); // Show success message in the contact section
  };

  // Expose functions globally for other pages
  useEffect(() => {
    window.__trustOpenSponsorForm = handleOpenSponsorForm;
    window.__trustOpenSiteForm = handleOpenSiteForm;
    return () => {
      delete window.__trustOpenSponsorForm;
      delete window.__trustOpenSiteForm;
    };
  }, []);

  // Handle scroll to contact section when URL hash is #contact
  useEffect(() => {
    // Expose a global helper so Navbar can open the form immediately when already on Home
    window.__trustOpenContactForm = (role) => {
      try {
        if (role) setFormType(role);
        setShowForm(true);
        setSuccessEmail('');
        const el = document.getElementById('contact-form-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {}
    };

    const handleHashChange = () => {
      if (window.location.hash.includes('#contact')) {
        const contactElement = document.getElementById('contact-form-section');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Auto-opening removed to prevent unwanted scrolling
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className={`text-slate-800`}>
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelect={handleRoleSelect}
      />
      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-br from-teal-50 to-blue-50 py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Full hero background icon */}
        <img
          src={`${import.meta.env.BASE_URL}Trust icon.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[3.5]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto lg:translate-x-12">
            {/* Left side - Main content */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Recruit Qualified Subjects—Fast & Predictable
              </h1>
              <div className="mt-6 mx-auto max-w-2xl">
                <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/70 shadow-sm p-6 text-left">
                  <ul className="space-y-3 text-base sm:text-lg text-slate-700">
                    <li className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-[#16B1F0] mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4A1 1 0 015.707 9.293L8 11.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>TRUST builds a steady pipeline of pre-qualified subjects so your study meets enrollment targets.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-[#16B1F0] mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4A1 1 0 015.707 9.293L8 11.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Our method blends targeted community outreach with nurse-led pre-screening to cut screen-fail rates and keep coordinators focused on visits.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-[#16B1F0] mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4A1 1 0 015.707 9.293L8 11.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>IRB-ready bilingual materials included.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
          {/* Right side - Flow to Eligible Candidates (Hover-only, consolidated) */}
          <div className="relative max-w-lg mx-auto lg:ml-16">
            <h3 className="sr-only">How we get to eligible candidates</h3>
            <div className="relative pl-8">
              {/* Vertical connector line */}
              <div aria-hidden="true" className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#16B1F0] via-[#56F0C8] to-[#10224E] rounded-full"></div>

              {(() => {
                const steps = [
                  { key: 'enrollment', title: 'Enrollment', desc: 'Our primary focus is meeting enrollment targets', dot: 'bg-[#16B1F0] text-white' },
                  { key: 'materials-marketing', title: 'Materials & Marketing', desc: 'IRB-approved flyers/brochures/landing pages + online outreach', dot: 'bg-[#56F0C8] text-[#0B1220]' },
                  { key: 'strategy-community', title: 'Strategy & Community', desc: 'Identify communities and execute boots-on-the-ground outreach', dot: 'bg-[#10224E] text-[#E8EEFC]' },
                  { key: 'screening', title: 'Screening', desc: 'Nurse-led pre-screening verifies eligibility', dot: 'bg-[#16B1F0] text-white' },
                  { key: 'eligible', title: 'Eligible', desc: 'Qualified, pre-screened subjects ready for enrollment', dot: 'bg-[#56F0C8] text-[#0B1220]' },
                ];
                return steps.map((step, index) => (
                  <div key={step.key} className="relative">
                    <div className="group relative flex items-start space-x-4 py-2">
                      <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white shadow-md ${step.dot}`} aria-hidden="true">
                        {step.key === 'eligible' ? '✓' : index + 1}
                      </div>
                      <div className="pt-0.5">
                        <div className="text-sm font-bold text-slate-900 lg:text-base">
                          <span className="inline-block px-3 py-1 rounded-full bg-white/70 border border-white/80 text-slate-800">
                            {step.title}
                          </span>
                        </div>
                        <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100">
                          <p className="text-sm text-slate-600 mt-2 pr-4">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="pl-4 py-1" aria-hidden="true">
                        <svg className="h-5 w-5 text-slate-400 mx-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3a1 1 0 011 1v9.586l2.293-2.293a1 1 0 111.414 1.414l-4.004 4.004a1 1 0 01-1.414 0L4.285 12.707a1 1 0 111.414-1.414L8 13.586V4a1 1 0 011-1z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              onClick={handleRequestProposalClick}
              className="bg-[#16B1F0] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg text-center"
            >
              Request Proposal
            </button>
          </div>
        </div>
        
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              TRUST recruits qualified subjects so sites and sponsors hit enrollment targets—fast and predictably.
            </h2>
            <p className="text-xl text-[#10224E] font-semibold">
              We combine community outreach and nurse-led pre-screening to reduce screen fails and coordinator burden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            <div className="p-6 bg-gradient-to-br from-[#10224E] to-[#0B1220] rounded-xl shadow-md text-white">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-[#E8EEFC] mb-2">Enrollment First</h3>
              <p className="text-[#A4B0CC]">
                Our north star is meeting your enrollment plan—not just generating clicks or inquiries.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-[#10224E] to-[#0B1220] rounded-xl shadow-md text-white">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-[#E8EEFC] mb-2">Quality Over Volume</h3>
              <p className="text-[#A4B0CC]">
                Nurse-led pre-screening delivers eligible, engaged referrals to your site.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-[#10224E] to-[#0B1220] rounded-xl shadow-md text-white">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-[#E8EEFC] mb-2">Predictable Pipeline</h3>
              <p className="text-[#A4B0CC]">
                Weekly outputs, transparent reporting, and fast iteration for steady accrual.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-[#10224E] to-[#0B1220] rounded-xl shadow-md text-white">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-[#E8EEFC] mb-2">Coordinator Relief</h3>
              <p className="text-[#A4B0CC]">
                We handle outreach and pre-screen so your team can run visits.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-[#10224E] to-[#0B1220] rounded-xl shadow-md text-white">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-[#E8EEFC] mb-2">Compliant by Design</h3>
              <p className="text-[#A4B0CC]">
                IRB-ready EN/ES materials and HIPAA-aware operations—without slowing recruitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section id="why-it-works" className="py-16 sm:py-20 bg-[#A4B0CC]/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1220] mb-4">
              Why It Works
            </h2>
            <p className="text-xl text-[#10224E]">
              The difference between online-only and TRUST approach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="p-6 bg-white rounded-xl shadow-md border border-red-200">
                <h3 className="text-2xl font-bold text-red-700 mb-3">Online-only approach:</h3>
                <p className="text-slate-700 text-lg">
                  Low-intent clicks → no-shows → high screen-fail
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md border border-teal-200">
                <h3 className="text-2xl font-bold text-teal-700 mb-3">TRUST approach:</h3>
                <p className="text-slate-700 text-lg mb-4">
                  In-person community outreach finds motivated candidates; nurse pre-screen filters for eligibility; sites receive ready-to-schedule referrals.
                </p>
                <p className="text-slate-700 font-semibold">
                  Result: faster FPI and steadier accrual.
                </p>
              </div>
            </div>
            <div 
              className="relative h-80 w-full rounded-xl shadow-lg flex items-center justify-center bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${import.meta.env.BASE_URL}trust (11).png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#16B1F0]/80 to-[#56F0C8]/80 rounded-xl"></div>
              <div className="relative text-center text-white p-8 z-10">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold mb-2">Community Collaboration</h3>
                <p className="text-xl font-semibold">
                  Drives enrollment success through trusted relationships and local engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1220] mb-4">
              Our Services
            </h2>
            <p className="text-xl text-[#10224E]">
              Comprehensive recruitment solutions for qualified, compliant enrollment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Marketing & Materials */}
            <div className="bg-gradient-to-br from-[#56F0C8]/10 to-[#16B1F0]/10 p-8 rounded-2xl shadow-lg border border-[#56F0C8]/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#16B1F0] rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📢</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1220]">IRB-Ready Bilingual Materials</h3>
              </div>
              <p className="text-[#10224E] mb-6 text-lg">
                Compliant, study-specific materials designed for qualified participant engagement and predictable enrollment.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bilingual promotional materials
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  IRB-approved flyers & brochures
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Study-specific folders & handouts
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Compliant recruitment materials
                </li>
              </ul>
            </div>

            {/* Digital Presence */}
            <div className="bg-gradient-to-br from-[#56F0C8]/10 to-[#16B1F0]/10 p-8 rounded-2xl shadow-lg border border-[#56F0C8]/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#16B1F0] rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🌐</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1220]">Digital Presence</h3>
              </div>
              <p className="text-[#10224E] mb-6 text-lg">
                Compliant digital platforms designed for qualified participant capture and predictable enrollment tracking.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  IRB-compliant landing pages
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Qualified participant forms
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pre-screening tracking systems
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mobile-optimized compliance
                </li>
              </ul>
            </div>

            {/* Community Outreach */}
            <div className="bg-gradient-to-br from-[#56F0C8]/10 to-[#16B1F0]/10 p-8 rounded-2xl shadow-lg border border-[#56F0C8]/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#16B1F0] rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">👥</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1220]">Bilingual Community Outreach</h3>
              </div>
              <p className="text-[#10224E] mb-6 text-lg">
                Targeted community engagement with qualified participant identification and compliant outreach processes.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  High-traffic location visits
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Major landmark engagement
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Community event participation
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Direct qualified participant engagement
                </li>
              </ul>
            </div>

            {/* Clinical Support */}
            <div className="bg-gradient-to-br from-[#56F0C8]/10 to-[#16B1F0]/10 p-8 rounded-2xl shadow-lg border border-[#56F0C8]/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#16B1F0] rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🩺</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1220]">Nurse-Led Clinical Support</h3>
              </div>
              <p className="text-[#10224E] mb-6 text-lg">
                Licensed nurse pre-screening and dedicated project management to ensure qualified enrollment and predictable timelines.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Licensed nurse pre-screening
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Qualified subject verification
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated project manager
                </li>
                <li className="flex items-center text-[#10224E]">
                  <svg className="w-5 h-5 text-[#16B1F0] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Predictable timeline monitoring
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-[#0B1220] mb-4">
              Ready to accelerate your study enrollment?
            </h3>
            <p className="text-lg text-[#10224E] mb-8">
              Let's discuss how our comprehensive services can meet your specific study requirements.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleRequestProposalClick}
                className="bg-[#16B1F0] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg text-center"
              >
                Request Proposal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Results Section */}
      <section id="proven-results" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-slate-600">
              See the difference our approach makes in patient recruitment outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Before TRACS</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut data={beforeData} options={chartOptions} />
              </div>
              <p className="text-slate-600 text-center mt-4">
                Traditional recruitment methods yield low enrollment rates
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">With TRACS</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut data={afterData} options={chartOptions} />
              </div>
              <p className="text-slate-600 text-center mt-4">
                Our approach delivers 3x higher enrollment rates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">3x</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">Higher Enrollment</div>
              <div className="text-slate-600">Compared to traditional methods</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">50%</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">Fewer Screen Failures</div>
              <div className="text-slate-600">Thanks to nurse pre-screening</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">Project Management</div>
              <div className="text-slate-600">Dedicated support throughout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form-section" className="py-16 sm:py-20 bg-[#A4B0CC]/10">
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
                Get a personalized proposal tailored to your specific needs and challenges.
              </p>
              <button
                onClick={handleRequestProposalClick}
                className="bg-[#16B1F0] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#10224E] transition-colors shadow-lg text-lg"
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
                A team member will get back to you shortly with your personalized proposal.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Enhanced Proposal Form Modal */}
      <EnhancedProposalForm
        isOpen={showEnhancedForm}
        onClose={() => setShowEnhancedForm(false)}
        formType={enhancedFormType}
        onSuccess={handleEnhancedFormSuccess}
      />
    </div>
  );
};

export default Home;
