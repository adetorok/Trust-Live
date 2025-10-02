import { useState, useEffect } from 'react';
import Protected from '../components/Protected';
import MeetingRequest from '../components/MeetingRequest';
import { auth } from '../utils/auth';

const SiteProposal = () => {
  const [userSession, setUserSession] = useState(null);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  useEffect(() => {
    const session = auth.getSession();
    setUserSession(session);
  }, []);

  const costConfig = {
    flyer: 1500,
    landingPage: 2200,
    printingPerStudy: 800,
    projectManagementPerStudy: 3000,
    outreachRate: 45,
    nurseRate: 60,
    discountPerAdditionalStudy: 2400
  };

  const [calculations, setCalculations] = useState({
    studies: 1,
    outreachHours: 20,
    nurseHours: 20
  });

  const calculateCosts = () => {
    const { studies, outreachHours, nurseHours } = calculations;
    
    const costs = {
      flyer: costConfig.flyer * studies,
      landingPage: costConfig.landingPage * studies,
      projectManagement: costConfig.projectManagementPerStudy * studies,
      printing: costConfig.printingPerStudy * studies,
      outreach: costConfig.outreachRate * outreachHours * studies,
      nurse: costConfig.nurseRate * nurseHours * studies,
    };

    const subtotal = Object.values(costs).reduce((sum, val) => sum + val, 0);
    const discountAmount = studies > 1 ? (studies - 1) * costConfig.discountPerAdditionalStudy : 0;
    const total = subtotal - discountAmount;

    return { costs, subtotal, discountAmount, total };
  };

  const { costs, subtotal, discountAmount, total } = calculateCosts();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSliderChange = (field, value) => {
    setCalculations(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const accordionItems = [
    {
      title: "A. Flyer Design & IRB Document Support",
      content: "Professional bilingual (English/Spanish) flyer design with up to 4 revisions and all supporting documentation for IRB submission."
    },
    {
      title: "B. Landing Page Development",
      content: "A modern, mobile-friendly landing page mirroring the approved flyer content to ensure rapid IRB approval. Includes a secure lead capture form."
    },
    {
      title: "C. Printing",
      content: "High-quality, full-color printing of 2,000 bilingual flyers per study, complete with a QR code linking to the study landing page."
    },
    {
      title: "D. Community Outreach",
      content: "Direct, in-person engagement at community hubs. The hourly rate for this service is $45."
    },
    {
      title: "E. Nurse-Led Subject Qualification",
      content: "LPN/RN/NP pre-screening of all incoming leads against protocol criteria. The hourly rate for this service is $60. Can be set to zero if not required."
    },
    {
      title: "F. Project Management & Oversight",
      content: "Full oversight of all recruitment activities, including team coordination and weekly progress reporting to ensure transparency for both the site and sponsor."
    }
  ];

  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <Protected requiredScope="site">
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Site Recruitment Proposal</h1>
              {userSession && (
                <div className="text-sm text-slate-600">
                  Welcome, {userSession.firstName} {userSession.lastName}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview */}
          <section className="mb-16">
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Interactive Proposal for Marketing Approval
              </h2>
              <p className="text-slate-600 mb-6">
                This interactive proposal outlines a structured recruitment program designed to address enrollment 
                challenges. Use the Cost Calculator below to model different scenarios by adjusting the number of 
                studies and service hours to see the financial impact in real-time. This tool provides flexibility 
                for planning and budget approval.
              </p>
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Core Services</h2>
            <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
              An integrated approach to solve recruitment challenges, from initial awareness to qualified referral.
            </p>

            <div className="space-y-8">
              <div className="bg-teal-50/50 p-8 rounded-xl shadow-md border border-teal-200 md:flex items-center gap-8">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600">
                    <span className="text-4xl">🤝</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-teal-800">Community Outreach</h3>
                  <p className="text-slate-600">
                    Direct, in-person engagement in high-traffic locations like gyms, malls, and community centers 
                    to raise awareness and distribute materials. This hands-on approach connects our team with potential 
                    participants where they live and work, building trust and generating high-quality leads.
                  </p>
                </div>
              </div>

              <div className="bg-teal-50/50 p-8 rounded-xl shadow-md border border-teal-200 md:flex items-center gap-8">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600">
                    <span className="text-4xl">🩺</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-teal-800">Nurse-Led Qualification</h3>
                  <p className="text-slate-600">
                    LPN/RN/NP time to contact and pre-screen every lead against protocol criteria. This critical 
                    step ensures only qualified and genuinely interested participants are referred to the site, 
                    saving coordinator time and improving screening-to-enrollment ratios.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Flyer Design & IRB Support</h3>
                <p className="text-slate-600">Creation of professional, bilingual (English & Spanish) flyers with full documentation support for IRB submission.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Landing Page Development</h3>
                <p className="text-slate-600">A modern, bilingual landing page mirroring approved flyer content with a secure lead capture form.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">🖨️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Printing</h3>
                <p className="text-slate-600">High-quality, full-color printing of 2,000 bilingual flyers per study with a QR code linking to the landing page.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Project Management</h3>
                <p className="text-slate-600">Dedicated oversight of all activities, including IRB coordination and weekly progress reporting.</p>
              </div>
            </div>
          </section>

          {/* Cost Calculator */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Interactive Cost Calculator</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">Adjust Your Plan</h3>
                
                <div>
                  <label className="flex justify-between items-center text-sm font-medium text-slate-700">
                    Number of Studies 
                    <span className="font-bold text-teal-600 text-base">{calculations.studies}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={calculations.studies}
                    onChange={(e) => handleSliderChange('studies', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between items-center text-sm font-medium text-slate-700">
                    Community Outreach Hours 
                    <span className="font-bold text-teal-600 text-base">{calculations.outreachHours} hrs</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={calculations.outreachHours}
                    onChange={(e) => handleSliderChange('outreachHours', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between items-center text-sm font-medium text-slate-700">
                    Nurse Qualification Hours 
                    <span className="font-bold text-teal-600 text-base">{calculations.nurseHours} hrs</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={calculations.nurseHours}
                    onChange={(e) => handleSliderChange('nurseHours', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <p className="text-xs text-slate-500 pt-2">
                  *For additional Studies, contact vendor manager for a custom offer.
                </p>
              </div>

              <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Estimated Investment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-200">
                    <span>Project Management & Oversight</span>
                    <span className="font-bold">{formatCurrency(costs.projectManagement)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-200">
                    <span>Landing Page Development</span>
                    <span className="font-bold">{formatCurrency(costs.landingPage)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-200">
                    <span>Flyer Design & IRB Support</span>
                    <span className="font-bold">{formatCurrency(costs.flyer)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-200">
                    <span>Nurse-Led Qualification</span>
                    <span className="font-bold">{formatCurrency(costs.nurse)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-200">
                    <span>Community Outreach</span>
                    <span className="font-bold">{formatCurrency(costs.outreach)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-200">
                    <span>Printing</span>
                    <span className="font-bold">{formatCurrency(costs.printing)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-200">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600 py-2 border-b border-slate-200">
                    <span>Multi-Study Discount</span>
                    <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-900 pt-4 font-bold text-2xl">
                    <span>Total Estimated Cost</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Scope */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Detailed Scope of Work</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {accordionItems.map((item, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-lg">
                  <button
                    className="w-full flex justify-between items-center text-left p-5 font-semibold text-slate-800"
                    onClick={() => toggleAccordion(index)}
                  >
                    {item.title}
                    <span className={`transform transition-transform duration-300 ${
                      openAccordion === index ? 'rotate-180' : ''
                    }`}>
                      ▼
                    </span>
                  </button>
                  {openAccordion === index && (
                    <div className="p-5 pt-0 text-slate-600">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Meeting Request */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Move Forward?</h2>
              <button
                onClick={() => setShowMeetingForm(true)}
                className="bg-teal-500 text-white font-bold px-6 py-2 rounded-md hover:bg-teal-600 transition-colors shadow"
              >
                Schedule Meeting to Finalize Proposal
              </button>
            </div>

            {showMeetingForm && (
              <MeetingRequest 
                path="site-proposal" 
                onClose={() => setShowMeetingForm(false)}
              />
            )}
          </section>
        </div>
      </div>
    </Protected>
  );
};

export default SiteProposal;

