import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

const OurServices = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [enhancedFormType, setEnhancedFormType] = useState('sponsor');

  const handleRequestProposalClick = () => {
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role) => {
    setShowRoleModal(false);
    setEnhancedFormType(role);
    setShowEnhancedForm(true);
  };

  const handleEnhancedFormSuccess = () => {
    setShowEnhancedForm(false);
    // You can add success handling here if needed
  };

  const services = [
    {
      title: "Nurse-Led Pre-Screening",
      description: "Our experienced nurses conduct comprehensive pre-screening interviews to identify eligible participants, reducing screen-fail rates by up to 60%.",
      features: [
        "Comprehensive eligibility assessment",
        "Medical history review",
        "Informed consent education",
        "Appointment scheduling coordination"
      ],
      icon: "👩‍⚕️"
    },
    {
      title: "Community Outreach & Marketing",
      description: "Our #1 differentiator - Targeted recruitment campaigns using IRB-approved materials to reach diverse populations and accelerate enrollment timelines. This is what makes TRUST special.",
      features: [
        "Multi-channel marketing campaigns",
        "Social media and digital advertising",
        "Community partnership development",
        "Bilingual materials and support"
      ],
      icon: "📢",
      isSpecial: true
    },
    {
      title: "IRB-Ready Materials",
      description: "Comprehensive package of pre-approved recruitment materials that can be customized for your specific study requirements.",
      features: [
        "Flyers and brochures",
        "Digital landing pages",
        "Social media content",
        "Email templates and newsletters"
      ],
      icon: "📋"
    },
    {
      title: "Site Support & Training",
      description: "Comprehensive support for clinical sites including training, materials, and ongoing consultation to ensure study success.",
      features: [
        "Site coordinator training",
        "Recruitment best practices",
        "Ongoing support and consultation",
        "Performance monitoring and reporting"
      ],
      icon: "🏥"
    },
    {
      title: "Technology Platform",
      description: "Advanced recruitment management system with real-time analytics, participant tracking, and automated workflows.",
      features: [
        "Real-time dashboard and analytics",
        "Participant tracking and management",
        "Automated reporting",
        "Integration with existing systems"
      ],
      icon: "💻"
    },
    {
      title: "Regulatory Compliance",
      description: "Full compliance with ICH-GCP, HIPAA, and other regulatory requirements to ensure study integrity and participant safety.",
      features: [
        "HIPAA and GDPR compliance",
        "ICH-GCP adherence",
        "Audit trail maintenance",
        "Regulatory documentation"
      ],
      icon: "⚖️"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Study Assessment",
      description: "We analyze your study requirements, target population, and recruitment challenges to develop a customized strategy."
    },
    {
      step: "2",
      title: "Material Development",
      description: "Create IRB-ready recruitment materials including flyers, brochures, and digital content tailored to your study."
    },
    {
      step: "3",
      title: "Community Outreach",
      description: "Launch targeted recruitment campaigns across multiple channels to reach potential participants in your area."
    },
    {
      step: "4",
      title: "Pre-Screening",
      description: "Our nurses conduct comprehensive pre-screening interviews to identify eligible participants and reduce screen-fail rates."
    },
    {
      step: "5",
      title: "Site Coordination",
      description: "Coordinate with clinical sites to schedule visits and ensure smooth participant flow throughout the study."
    },
    {
      step: "6",
      title: "Ongoing Support",
      description: "Provide continuous support, monitoring, and reporting to ensure your study meets enrollment targets."
    }
  ];

  return (
    <div className={showRoleModal ? 'pointer-events-none' : ''}>
      <Helmet>
        <title>Our Services - TRUST Clinical Services</title>
        <meta name="description" content="Discover TRUST Clinical Services' comprehensive suite of clinical trial recruitment services including nurse-led pre-screening, community outreach, and technology solutions." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-blue-50 py-12 sm:py-16 lg:py-20">
        {/* Full hero background icon */}
        <img
          src="/Trust icon.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[4] -translate-x-[8%]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Comprehensive clinical trial recruitment solutions designed for success
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Recruitment Solutions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From initial study assessment to participant enrollment, we provide end-to-end recruitment services 
              that accelerate timelines and improve study success rates.
            </p>
          </div>

          {/* Key Differentiator Callout */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 mb-12 text-white text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold mb-4">What Makes TRUST Special?</h3>
            <p className="text-xl mb-4 font-medium">
              Our <strong>Community Outreach & Marketing</strong> is our #1 differentiator
            </p>
            <p className="text-lg opacity-90 max-w-4xl mx-auto">
              While others focus on technology or processes, we excel at reaching diverse communities through 
              targeted, IRB-approved marketing campaigns that build trust and accelerate enrollment. 
              This is what sets us apart and drives our clients' success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`rounded-lg p-6 hover:shadow-lg transition-shadow ${
                  service.isSpecial 
                    ? 'bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 shadow-lg' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  service.isSpecial ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {service.isSpecial && <span className="text-2xl">⭐ </span>}
                  {service.title}
                  {service.isSpecial && <span className="text-sm font-normal text-blue-600 block mt-1">#1 Differentiator</span>}
                </h3>
                <p className={`mb-4 ${
                  service.isSpecial ? 'text-blue-800 font-medium' : 'text-gray-600'
                }`}>
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className={`mr-2 ${
                        service.isSpecial ? 'text-blue-500' : 'text-green-500'
                      }`}>✓</span>
                      <span className={`text-sm ${
                        service.isSpecial ? 'text-blue-700' : 'text-gray-600'
                      }`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-lg text-gray-600">
              A proven methodology that delivers results
            </p>
          </div>
          
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose TRUST?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">60% Reduction in Screen-Fail Rates</h3>
                    <p className="text-gray-600">Our nurse-led pre-screening process significantly reduces wasted visits and improves study efficiency.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Faster Time-to-Enrollment</h3>
                    <p className="text-gray-600">Accelerate your study timeline with our proven recruitment strategies and community outreach.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost-Effective Solutions</h3>
                    <p className="text-gray-600">Reduce recruitment costs while improving quality through our efficient processes and technology platform.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Compliance</h3>
                    <p className="text-gray-600">Full compliance with ICH-GCP, HIPAA, and other regulations ensures study integrity and participant safety.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Contact us today to discuss how TRUST can help accelerate your clinical trial recruitment.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleRequestProposalClick}
                  className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Request a Proposal
                </button>
                <button
                  onClick={() => {
                    // Scroll to footer contact section
                    const contactSection = document.querySelector('#contact-section');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block w-full border border-blue-600 text-blue-600 text-center py-3 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Contact Our Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Let's Accelerate Your Study
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join hundreds of sponsors and sites who trust us with their recruitment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRequestProposalClick}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Request Proposal
            </button>
            <button
              onClick={handleRequestProposalClick}
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Request Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelect={handleRoleSelect}
      />

      {/* Enhanced Proposal Form */}
      <EnhancedProposalForm
        isOpen={showEnhancedForm}
        onClose={() => setShowEnhancedForm(false)}
        formType={enhancedFormType}
        onSuccess={handleEnhancedFormSuccess}
      />
    </div>
  );
};

export default OurServices;
