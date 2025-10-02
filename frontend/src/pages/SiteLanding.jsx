import { useState } from 'react';
import FormSiteQuote from '../components/FormSiteQuote';

const SiteLanding = () => {
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
            Accelerate Your Clinical Trial Enrollment
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We provide end-to-end recruitment support, from community outreach to nurse-led pre-qualification, 
            to deliver high-quality, engaged participants for your studies.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Our High-Impact Services</h2>
            <p className="text-lg text-slate-600 mt-2">A proven process to find and qualify the right participants.</p>
          </div>

          <div className="space-y-12">
            <div className="md:flex items-center gap-12">
              <div className="md:w-1/2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                  <span className="text-4xl">🤝</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-teal-800">Domestic Community Outreach</h3>
                <p className="text-slate-600">
                  Our core strength is hands-on, in-person engagement. We go to gyms, malls, community centers, 
                  and local events to connect directly with potential participants. This builds trust, raises awareness, 
                  and generates qualified leads that online campaigns often miss.
                </p>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-slate-200 rounded-lg h-64 w-full">
                  <img
                    src="https://placehold.co/600x400/e2e8f0/334155?text=Community+Engagement"
                    alt="Community Outreach"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="md:flex items-center gap-12 flex-row-reverse">
              <div className="md:w-1/2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                  <span className="text-4xl">🩺</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-teal-800">Nurse-Led Subject Qualification</h3>
                <p className="text-slate-600">
                  Stop wasting valuable coordinator time on unqualified leads. Our team of LPNs, RNs, and NPs 
                  contacts every lead to pre-screen them against your protocol's inclusion/exclusion criteria. 
                  You only receive referrals who are eligible and ready to proceed.
                </p>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-slate-200 rounded-lg h-64 w-full">
                  <img
                    src="https://placehold.co/600x400/e2e8f0/334155?text=Qualified+Referrals"
                    alt="Nurse Qualification"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">
              Comprehensive Support Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Flyer Design & IRB Support</h4>
                <p className="text-slate-600 text-sm">
                  We design professional, bilingual flyers and provide full documentation support to 
                  streamline your IRB approval process.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Study-Specific Landing Pages</h4>
                <p className="text-slate-600 text-sm">
                  You get a modern, mobile-friendly landing page for each study, designed to match 
                  approved flyers for quick IRB sign-off.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">🖨️</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Printing Services</h4>
                <p className="text-slate-600 text-sm">
                  High-quality, full-color printing of all your recruitment materials, ready for 
                  distribution in the community.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Project Management</h4>
                <p className="text-slate-600 text-sm">
                  Dedicated oversight of the entire recruitment process with transparent, weekly 
                  reporting to you and your sponsor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">Get Your Custom Proposal</h2>
          <p className="text-lg text-slate-600 mt-2 mb-8">
            Enter your corporate email to receive a secure link to our interactive proposal and cost calculator.
          </p>

          {!successEmail ? (
            <FormSiteQuote onSuccess={handleFormSuccess} />
          ) : (
            <div className="text-left bg-teal-50 border-l-4 border-teal-500 text-teal-800 p-6 rounded-md">
              <h4 className="font-bold text-lg mb-2">Verification Required</h4>
              <p>
                Thank you! An email has been sent to <strong>{successEmail}</strong>. 
                Please click the link in the email to verify your address and access the full proposal.
              </p>
              <div className="mt-4">
                <a 
                  href="/site/proposal" 
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

export default SiteLanding;

