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

  const handleFormSubmit = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  const handleSuccess = (email) => {
    setSuccessEmail(email);
    setShowForm(false);
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
      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 lg:mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6">
                Accelerate Your Clinical Trial
                <span className="block text-teal-600">Recruitment Success</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                TRACS specializes in <strong>high-touch, human-first patient recruitment</strong> that delivers 
                qualified participants to your clinical trials faster than traditional digital-only approaches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleFormSubmit('sponsor')}
                  className="bg-teal-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-teal-700 transition-colors shadow-lg"
                >
                  Get Sponsor Proposal
                </button>
                <button
                  onClick={() => handleFormSubmit('site')}
                  className="bg-white text-teal-600 border-2 border-teal-600 font-bold px-8 py-4 rounded-lg text-lg hover:bg-teal-50 transition-colors shadow-lg"
                >
                  Get Site Proposal
                </button>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-teal-600 mb-2">3x</div>
                <div className="text-slate-600 font-medium">Higher Enrollment Rate</div>
              </div>
              <div className="text-center bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-teal-600 mb-2">50%</div>
                <div className="text-slate-600 font-medium">Reduction in Screen Failures</div>
              </div>
              <div className="text-center bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-teal-600 mb-2">24h</div>
                <div className="text-slate-600 font-medium">Average Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                What We Do
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We solve the #1 challenge in clinical trials: finding and enrolling the right patients quickly and efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                  We're Not Just Another Recruitment Vendor
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Strategic Community Outreach</h4>
                      <p className="text-slate-600">
                        Our teams go directly to where your target patients are: community centers, 
                        healthcare facilities, pharmacies, and medical practices. We build relationships 
                        and trust through face-to-face interactions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Nurse-Led Pre-Screening</h4>
                      <p className="text-slate-600">
                        Every interested person is contacted by a licensed nurse who conducts thorough 
                        pre-screening against your protocol criteria. This eliminates unqualified leads 
                        before they reach your site.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Complete Project Management</h4>
                      <p className="text-slate-600">
                        We handle everything from IRB documentation to site coordination, ensuring 
                        smooth enrollment and reducing your administrative burden.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-8 rounded-xl">
                <h4 className="text-xl font-bold text-slate-900 mb-6 text-center">Our Process</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-slate-700">Identify target patient populations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-slate-700">Deploy community outreach teams</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-slate-700">Conduct nurse-led pre-screening</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span className="text-slate-700">Deliver qualified participants to sites</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <span className="text-slate-700">Provide ongoing support and reporting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                The Problem We Solve
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Clinical trial recruitment is broken. Here's how we fix it.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* The Problem */}
              <div className="bg-red-50 p-8 rounded-xl border-l-4 border-red-500">
                <h3 className="text-2xl font-bold text-red-800 mb-6">❌ The Traditional Approach</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">•</span>
                    <span className="text-slate-700">Passive digital ads that cast a wide, impersonal net</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">•</span>
                    <span className="text-slate-700">High volume of unqualified leads and no-shows</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">•</span>
                    <span className="text-slate-700">Sites overwhelmed with screen failures</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">•</span>
                    <span className="text-slate-700">Missed enrollment targets and delayed timelines</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">•</span>
                    <span className="text-slate-700">Wasted time and resources on unqualified participants</span>
                  </li>
                </ul>
              </div>

              {/* The Solution */}
              <div className="bg-green-50 p-8 rounded-xl border-l-4 border-green-500">
                <h3 className="text-2xl font-bold text-green-800 mb-6">✅ The TRACS Solution</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">•</span>
                    <span className="text-slate-700">Strategic, targeted community outreach</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">•</span>
                    <span className="text-slate-700">Nurse-led pre-screening eliminates unqualified leads</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">•</span>
                    <span className="text-slate-700">Sites receive only qualified, engaged participants</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">•</span>
                    <span className="text-slate-700">Faster enrollment and predictable results</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">•</span>
                    <span className="text-slate-700">Reduced coordinator workload and improved efficiency</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Proven Results
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our high-touch approach consistently delivers superior enrollment rates compared to digital-only campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Typical Digital-Only Campaign</h3>
                <div className="max-w-xs mx-auto mb-6">
                  <Doughnut data={beforeData} options={chartOptions} />
                </div>
                <p className="text-slate-600 text-sm">
                  Low conversion rates and high volume of unqualified leads result in wasted time and missed enrollment targets.
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-teal-800 mb-4">With TRACS High-Touch Model</h3>
                <div className="max-w-xs mx-auto mb-6">
                  <Doughnut data={afterData} options={chartOptions} />
                </div>
                <p className="text-slate-600 text-sm">
                  By focusing on in-person outreach and rigorous pre-screening, we deliver a much higher percentage of qualified, enrolled participants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Who We Serve
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We work with both sponsors who need participants and sites who need to fill their studies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sponsors/CROs */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Sponsors & CROs</h3>
                  <p className="text-slate-600">
                    Pharmaceutical companies, biotech firms, medical device manufacturers, and contract research organizations
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">Portfolio-wide recruitment strategies</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">Multi-site coordination and management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">Centralized nurse-led pre-screening</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">Transparent reporting and analytics</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <button
                    onClick={() => handleFormSubmit('sponsor')}
                    className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Get Sponsor Proposal
                  </button>
                </div>
              </div>

              {/* Sites */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Clinical Trial Sites</h3>
                  <p className="text-slate-600">
                    Hospitals, research centers, physician practices, and site management organizations
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">End-to-end recruitment support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">Community outreach and engagement</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">IRB documentation assistance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-teal-600">✓</span>
                    <span className="text-slate-700">Study-specific landing pages</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <button
                    onClick={() => handleFormSubmit('site')}
                    className="w-full bg-white text-teal-600 border-2 border-teal-600 font-semibold py-3 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    Get Site Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Ready to Accelerate Your Recruitment?
              </h2>
              <p className="text-xl text-slate-600">
                Get a personalized proposal tailored to your specific needs and challenges.
              </p>
            </div>

            {!showForm && !successEmail && (
              <div className="bg-slate-50 p-8 rounded-xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Choose Your Path</h3>
                  <p className="text-slate-600">
                    Tell us about your organization so we can provide the most relevant information.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => handleFormSubmit('sponsor')}
                    className="p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">I'm a Sponsor or CRO</h4>
                        <p className="text-slate-600 text-sm">Looking for patient recruitment services</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleFormSubmit('site')}
                    className="p-6 bg-white rounded-lg border-2 border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏥</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">I'm a Clinical Trial Site</h4>
                        <p className="text-slate-600 text-sm">Looking for recruitment support</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {showForm && (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                {formType === 'sponsor' ? (
                  <FormSponsorQuote onSuccess={handleSuccess} />
                ) : (
                  <FormSiteQuote onSuccess={handleSuccess} />
                )}
              </div>
            )}

            {successEmail && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                  <span className="text-4xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                <p className="text-slate-600 mb-6">
                  Your request has been received. Please check your email for a verification link to access your tailored proposal.
                </p>
                <button
                  onClick={() => {
                    setSuccessEmail('');
                    setShowForm(false);
                  }}
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  Submit another request
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;