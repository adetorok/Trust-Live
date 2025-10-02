import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import FormSponsorQuote from '../components/FormSponsorQuote';
import FormSiteQuote from '../components/FormSiteQuote';

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('sponsor');
  const [successEmail, setSuccessEmail] = useState('');

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

  const handleRequestProposal = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  // Handle scroll to contact section when URL hash is #contact
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#contact') {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="text-slate-800">
      {/* Hero Section */}
      <section id="hero" className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-24 px-4 sm:px-6 lg:px-8">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-500 mb-2 text-center lg:text-left">
            We Are The ...
          </h2>
          <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            {/* Power Words */}
            <div className="bubble absolute flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full z-0" style={{top: '5%', left: '15%', animationDelay: '-2s', animationDuration: '18s'}}>
              <span className="font-bold text-slate-500">Elite</span>
            </div>
            <div className="bubble absolute flex items-center justify-center w-14 h-14 bg-slate-100 rounded-full z-0" style={{top: '70%', left: '5%', animationDelay: '-5s', animationDuration: '20s'}}>
              <span className="font-bold text-slate-500">Apex</span>
            </div>
            <div className="bubble absolute flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full z-0" style={{top: '10%', right: '10%', animationDelay: '-8s', animationDuration: '16s'}}>
              <span className="font-bold text-slate-500">Gold</span>
            </div>
            <div className="bubble absolute flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full z-0" style={{bottom: '5%', right: '25%', animationDelay: '-1s', animationDuration: '22s'}}>
              <span className="font-bold text-slate-500">Prime</span>
            </div>
            <div className="bubble absolute flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full z-0" style={{top: '45%', right: '5%', animationDelay: '-10s', animationDuration: '19s'}}>
              <span className="font-bold text-slate-500">Core</span>
            </div>
            <div className="bubble absolute flex items-center justify-center w-14 h-14 bg-slate-100 rounded-full z-0" style={{bottom: '15%', left: '35%', animationDelay: '-7s', animationDuration: '17s'}}>
              <span className="font-bold text-slate-500">Peak</span>
            </div>
            
            {/* Vendor Bubbles */}
            <div data-tooltip="Sponsors (Pharma, Biotech, Device, etc.)" className="bubble absolute flex items-center justify-center w-40 h-40 bg-teal-200 rounded-full shadow-lg z-20" style={{top: '20%', left: '25%', animationDelay: '-1s', animationDuration: '20s'}}>
              <span className="text-3xl font-extrabold text-teal-800">Sponsor</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Sponsors (Pharma, Biotech, etc.)</div>
            </div>
            <div data-tooltip="Independent Clinical Research Site" className="bubble absolute flex items-center justify-center w-36 h-36 bg-white border-2 border-teal-300 rounded-full shadow-lg z-20" style={{top: '55%', left: '50%', animationDelay: '-3s', animationDuration: '18s'}}>
              <span className="text-3xl font-extrabold text-teal-800">Site</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Independent Clinical Research Site</div>
            </div>
            <div data-tooltip="Contract Research Organization" className="bubble absolute flex items-center justify-center w-32 h-32 bg-teal-100 rounded-full shadow-lg z-20" style={{top: '50%', left: '10%', animationDelay: '-2.5s', animationDuration: '22s'}}>
              <span className="text-2xl font-extrabold text-teal-800">CRO</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Contract Research Organization</div>
            </div>
            <div data-tooltip="Academic Medical Center" className="bubble absolute flex items-center justify-center w-28 h-28 bg-white border border-teal-200 rounded-full shadow-md z-10" style={{top: '5%', left: '55%', animationDelay: '-4s', animationDuration: '19s'}}>
              <span className="text-2xl font-bold text-teal-700">AMC</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Academic Medical Center</div>
            </div>
            <div data-tooltip="Site Management Organization" className="bubble absolute flex items-center justify-center w-24 h-24 bg-white border border-teal-200 rounded-full shadow-md z-10" style={{bottom: '10%', left: '20%', animationDelay: '-6s', animationDuration: '21s'}}>
              <span className="text-xl font-bold text-teal-700">SMO</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Site Management Organization</div>
            </div>
            <div data-tooltip="Patient Recruitment Vendor" className="bubble absolute flex items-center justify-center w-24 h-24 bg-teal-50 rounded-full shadow-sm z-10" style={{top: '35%', right: '15%', animationDelay: '-7s', animationDuration: '23s'}}>
              <span className="text-xl font-bold text-teal-700">PRV</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Patient Recruitment Vendor</div>
            </div>
            <div data-tooltip="Hospitals and Health Systems" className="bubble absolute flex items-center justify-center w-20 h-20 bg-teal-50 rounded-full shadow-sm z-10" style={{bottom: '25%', right: '5%', animationDelay: '-9s', animationDuration: '17s'}}>
              <span className="text-lg font-medium text-teal-600">HS</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Hospitals & Health Systems</div>
            </div>
            <div data-tooltip="Principal Investigator–led Sites" className="bubble absolute flex items-center justify-center w-20 h-20 bg-teal-50 rounded-full shadow-sm z-10" style={{top: '75%', left: '30%', animationDelay: '-1.5s', animationDuration: '19s'}}>
              <span className="text-lg font-medium text-teal-600">PI Sites</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Physician-led Sites</div>
            </div>
            <div data-tooltip="Institutional Review Board / Ethics Committee" className="bubble absolute flex items-center justify-center w-20 h-20 bg-white border border-teal-200 rounded-full shadow-sm z-10" style={{top: '15%', left: '0%', animationDelay: '-3.5s', animationDuration: '25s'}}>
              <span className="text-lg font-medium text-teal-600">IRB/EC</span>
              <div className="tooltip absolute -top-10 bg-slate-800 text-white text-xs rounded py-1 px-2">Institutional Review Board</div>
            </div>
          </div>
        </div>
        
        <div id="contact" className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 order-1 lg:order-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4 text-center lg:text-left">
            Study Subject Recruiter
          </h1>
          
          {!showForm && !successEmail && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Request a Proposal</h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleRequestProposal('sponsor')}
                  className="w-full bg-teal-600 text-white font-semibold py-3 rounded-md hover:bg-teal-700 transition-colors shadow-sm"
                >
                  I'm a Sponsor / CRO
                </button>
                <button
                  onClick={() => handleRequestProposal('site')}
                  className="w-full bg-white text-teal-600 border border-teal-600 font-semibold py-3 rounded-md hover:bg-teal-50 transition-colors shadow-sm"
                >
                  I'm a Site / Vendor
                </button>
              </div>
            </div>
          )}
          
          {showForm && !successEmail && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {formType === 'sponsor' ? 'Sponsor Quote Request' : 'Site Quote Request'}
              </h2>
              {formType === 'sponsor' ? (
                <FormSponsorQuote onSuccess={handleFormSuccess} />
              ) : (
                <FormSiteQuote onSuccess={handleFormSuccess} />
              )}
              <button
                onClick={() => setShowForm(false)}
                className="mt-4 text-slate-600 hover:text-slate-800"
              >
                ← Back to options
              </button>
            </div>
          )}
          
          {successEmail && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
              <p className="text-slate-600">
                Your request has been received. Please check your email for a verification link to access your tailored proposal.
              </p>
              <button
                onClick={() => {
                  setSuccessEmail('');
                  setShowForm(false);
                }}
                className="mt-4 text-teal-600 hover:text-teal-800"
              >
                Submit another request
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">The Difference is Clear:</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-8 sm:mb-12">Why Our Approach Succeeds</h3>
          <div className="flex flex-col items-center justify-center space-y-4 mb-8 sm:mb-12">
            <div className="stop-sign bg-red-600 h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-3xl sm:text-4xl">STOP</span>
            </div>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl px-4">
              ...relying on passive online marketing that delivers unqualified leads, no-shows, and frustration.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* The Old Way */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
            <h4 className="text-xl sm:text-2xl font-bold text-slate-500 mb-6 text-center">The "Online-Only" Model</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-2xl mr-4 text-red-500">&times;</span>
                <div>
                  <h5 className="font-semibold text-slate-800">Passive Digital Ads</h5>
                  <p className="text-slate-600">Casts a wide, impersonal net, hoping the right people click. This approach ignores the human element of trust required for clinical trial participation.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-4 text-red-500">&times;</span>
                <div>
                  <h5 className="font-semibold text-slate-800">Unvetted, Low-Quality Leads</h5>
                  <p className="text-slate-600">Floods your site with contacts who may not be eligible, don't return calls, or misunderstand the commitment, leading to wasted effort.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-4 text-red-500">&times;</span>
                <div>
                  <h5 className="font-semibold text-slate-800">High Site Burden & Frustration</h5>
                  <p className="text-slate-600">Your coordinators spend countless hours chasing down ghosts and screening ineligible subjects, pulling them away from critical trial duties.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-4 text-red-500">&times;</span>
                <div>
                  <h5 className="font-semibold text-slate-800">Disappointing Results</h5>
                  <p className="text-slate-600">High cost-per-acquisition with low enrollment rates, putting your study timelines and budget at risk.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Our Way */}
          <div className="bg-teal-50/50 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-500">
            <h4 className="text-xl sm:text-2xl font-bold text-teal-800 mb-6 text-center">Our High-Touch, Human-First Approach</h4>
            <ul className="space-y-6">
              <li className="flex items-start">
                <span className="text-3xl mr-4 text-teal-600">1.</span>
                <div>
                  <h5 className="font-semibold text-slate-800">Step 1: Strategic "Boots-on-the-Ground" Outreach</h5>
                  <p className="text-slate-600">We don't wait for subjects to find us; <span className="font-semibold">we go where they are</span>. Our teams target locations relevant to your protocol, engaging in one-on-one conversations at community centers, health clinics, hospitals, and pharmacies. We talk to doctors, distribute flyers, and answer questions in person, building the human trust that is essential for recruitment success.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-3xl mr-4 text-teal-600">2.</span>
                <div>
                  <h5 className="font-semibold text-slate-800">Step 2: Rigorous Nurse-Led Pre-Screening</h5>
                  <p className="text-slate-600">Every interested individual is contacted by a licensed nurse. This is not a call center; it's a clinical conversation. Our nurses confirm the indication, review inclusion/exclusion criteria, discuss medications, and check for necessary documentation like x-rays or reports. We stop screen failures before they ever reach your site.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-4 text-green-500">✓</span>
                <div>
                  <h5 className="font-semibold text-slate-800">The Result: Quality & Predictability</h5>
                  <p className="text-slate-600">Your site receives a steady stream of <span className="font-semibold">pre-qualified, genuinely interested, and engaged participants</span>. This dramatically reduces coordinator workload, accelerates enrollment, and provides predictable results for your trial.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-12 sm:py-16 bg-white rounded-xl shadow-lg border border-slate-200 mt-12 sm:mt-16 mx-4 sm:mx-6 lg:mx-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Proven Results: See the Difference</h2>
            <p className="text-base sm:text-lg text-slate-600 mt-2 max-w-3xl mx-auto px-4">
              Data shows our high-touch model dramatically outperforms standard digital campaigns in delivering enrolled subjects.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Typical "Online-Only" Campaign</h3>
              <div className="max-w-xs mx-auto">
                <Doughnut data={beforeData} options={chartOptions} />
              </div>
              <p className="mt-4 text-slate-600 text-sm sm:text-base">Low conversion rates and high volume of unqualified leads result in wasted time and missed enrollment targets.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-teal-800 mb-4">With Our High-Touch Approach</h3>
              <div className="max-w-xs mx-auto">
                <Doughnut data={afterData} options={chartOptions} />
              </div>
              <p className="mt-4 text-slate-600 text-sm sm:text-base">By focusing on in-person outreach and rigorous pre-screening, we deliver a much higher percentage of qualified, enrolled participants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900">Your End-to-End Recruitment Partner</h2>
          <p className="text-lg text-slate-600 mt-2 max-w-3xl mx-auto">
            We provide a fully managed, transparent process from strategy to final enrollment.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-teal-600 text-white text-3xl font-bold shadow-lg">1</div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <h3 className="text-xl font-bold text-slate-900">Custom Marketing & IRB Documentation</h3>
              <p className="text-slate-600 mt-2">We start by developing bespoke, bilingual marketing materials (flyers, brochures) tailored to your study. Our team handles the preparation of all necessary documentation to ensure a smooth and efficient IRB submission and approval process.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-teal-600 text-white text-3xl font-bold shadow-lg">2</div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <h3 className="text-xl font-bold text-slate-900">High-Conversion Landing Pages</h3>
              <p className="text-slate-600 mt-2">For each study, we create a dedicated, modern, and mobile-friendly landing page. Designed to mirror IRB-approved materials, these pages act as a digital hub to securely capture interest from potential participants 24/7.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-teal-600 text-white text-3xl font-bold shadow-lg">3</div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <h3 className="text-xl font-bold text-slate-900">Strategic "Boots-on-the-Ground" Outreach</h3>
              <p className="text-slate-600 mt-2">This is our key differentiator. Our teams engage in targeted, in-person recruitment at community hot-spots. We build trust through one-on-one conversations, answer questions, and find candidates that digital ads will never reach.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-teal-600 text-white text-3xl font-bold shadow-lg">4</div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <h3 className="text-xl font-bold text-slate-900">Rigorous Nurse-Led Pre-Screening</h3>
              <p className="text-slate-600 mt-2">Every lead is contacted by a licensed nurse for a thorough clinical pre-screening against your I/E criteria. We verify medications, indications, and review documentation like X-rays if needed, ensuring only the most qualified candidates are sent to your site.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-teal-600 text-white text-3xl font-bold shadow-lg">5</div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <h3 className="text-xl font-bold text-slate-900">Senior-Level Study Management & Reporting</h3>
              <p className="text-slate-600 mt-2">A senior-level Study Manager oversees your entire campaign. You receive detailed weekly updates on outreach activities, leads generated, and screening progress, ensuring full transparency and alignment with your goals.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <h3 className="text-4xl font-extrabold text-teal-800 leading-tight">TRAC</h3>
          <p className="text-lg text-slate-700 font-semibold">Trial Recruitment and Clinical Services</p>
          <p className="text-lg text-slate-600 mt-4">Keeping clinical trials on track with faster, smarter recruitment.</p>
          <a 
            href="#contact" 
            className="inline-block mt-8 bg-teal-600 text-white font-semibold py-4 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-transform hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              const contactElement = document.getElementById('contact');
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Request a Proposal
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

