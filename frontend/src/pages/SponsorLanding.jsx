import { useState } from 'react';
import FormSponsorQuote from '../components/FormSponsorQuote';

const SponsorLanding = () => {
  const [successEmail, setSuccessEmail] = useState('');

  const handleFormSuccess = (email) => {
    setSuccessEmail(email);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            De-Risk Your Timelines. Maximize Trial ROI.
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We are your dedicated recruitment partner, providing scalable, multi-site solutions to ensure 
            your clinical trial portfolio meets its enrollment targets efficiently and predictably.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Our Strategic Sponsor Services</h2>
            <p className="text-lg text-slate-600 mt-2">
              A centralized system for predictable, high-quality enrollment across your entire portfolio.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                  <span className="text-4xl">👟</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-teal-800">
                  Domestic Outreach: Real Leg Work, Real Engagement
                </h3>
              </div>
              <p className="text-center max-w-3xl mx-auto text-slate-600">
                While others rely on online marketing that has failed so many, our strength is active, in-person engagement. 
                We deploy teams to do the real leg work—walking around and engaging with potential participants at community 
                hot spots. This direct approach builds trust, reaches diverse populations, and uncovers qualified candidates 
                that digital-only funnels simply cannot find.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-teal-800">
                  Nurse Prescreening for Study Eligibility
                </h3>
              </div>
              <p className="text-center max-w-3xl mx-auto text-slate-600">
                Reduce screen failure rates and guarantee site satisfaction. Our licensed nurses conduct rigorous prescreening 
                for every lead against your protocol's specific criteria. We provide your sites with a pipeline of not just 
                interested, but truly qualified and pre-approved subjects, saving time and maximizing your investment.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">
              End-to-End Campaign Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Portfolio-Wide IRB Support</h4>
                <p className="text-slate-600 text-sm">
                  We manage the creation and submission of all recruitment materials, ensuring brand consistency 
                  and IRB compliance across all sites.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Consistent Digital Presence</h4>
                <p className="text-slate-600 text-sm">
                  Launch uniform, study-specific landing pages for each trial in your portfolio, providing a 
                  professional and consistent experience for participants.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">🖨️</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Centralized Material Production</h4>
                <p className="text-slate-600 text-sm">
                  We handle all printing and material logistics, ensuring every site has the high-quality 
                  flyers they need for outreach campaigns.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Transparent Project Management</h4>
                <p className="text-slate-600 text-sm">
                  Receive weekly, portfolio-level progress reports. Our dedicated project managers provide 
                  the oversight and data you need for confident decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">Get a Proposal for Your Portfolio</h2>
          <p className="text-lg text-slate-600 mt-2 mb-8">
            Provide your corporate details to receive a secure link to our interactive cost calculator, 
            designed for sponsor-level planning.
          </p>

          {!successEmail ? (
            <FormSponsorQuote onSuccess={handleFormSuccess} />
          ) : (
            <div className="text-left bg-teal-50 border-l-4 border-teal-500 text-teal-800 p-6 rounded-md">
              <h4 className="font-bold text-lg mb-2">Verification Required</h4>
              <p>
                Thank you! A secure link has been sent to <strong>{successEmail}</strong>. 
                Please check your email to access the full interactive proposal.
              </p>
              <div className="mt-4">
                <a 
                  href="/sponsor/proposal" 
                  className="inline-block bg-teal-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Access Proposal Now &rarr;
                </a>
                <p className="text-xs text-slate-500 mt-2">
                  (For demo purposes, you can access the proposal directly.)
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SponsorLanding;

