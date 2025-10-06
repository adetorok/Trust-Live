import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

const SponsorLanding = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [enhancedFormType, setEnhancedFormType] = useState('sponsor');

  const handleRequestProposalClick = () => {
    // Since we're on the sponsor page, directly open the sponsor form
    setEnhancedFormType('sponsor');
    setShowEnhancedForm(true);
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

  const sponsorServices = [
    {
      title: "Strategic Study Design Support",
      description: "Expert consultation on protocol development, feasibility assessment, and site selection to optimize your study's success.",
      features: [
        "Protocol optimization recommendations",
        "Feasibility study coordination",
        "Site selection and qualification",
        "Regulatory pathway guidance"
      ],
      icon: "🎯"
    },
    {
      title: "Accelerated Patient Recruitment",
      description: "Our proven recruitment strategies deliver qualified participants faster, reducing enrollment timelines by up to 40%.",
      features: [
        "Multi-channel recruitment campaigns",
        "Nurse-led pre-screening",
        "Community partnership development",
        "Real-time enrollment tracking"
      ],
      icon: "⚡"
    },
    {
      title: "Comprehensive Site Management",
      description: "End-to-end site support from initiation to closeout, ensuring consistent performance across all study sites.",
      features: [
        "Site training and certification",
        "Ongoing monitoring and support",
        "Performance analytics and reporting",
        "Risk mitigation strategies"
      ],
      icon: "🏥"
    },
    {
      title: "Regulatory & Compliance Excellence",
      description: "Full ICH-GCP compliance with comprehensive documentation and audit support throughout your study lifecycle.",
      features: [
        "IRB/EC submission support",
        "Regulatory document management",
        "Audit preparation and support",
        "Compliance monitoring"
      ],
      icon: "📋"
    }
  ];

  const benefits = [
    "Reduce enrollment timelines by up to 40%",
    "Lower screen-fail rates by 60%",
    "Access to diverse patient populations",
    "Streamlined regulatory processes",
    "Real-time study performance insights",
    "Dedicated project management team"
  ];

  return (
    <>
      <Helmet>
        <title>Sponsor & CRO Services - TRUST Clinical Services</title>
        <meta name="description" content="Comprehensive clinical trial services for sponsors and CROs. Accelerate enrollment, reduce costs, and ensure regulatory compliance with TRUST." />
        <link rel="canonical" href="https://trustclinicalservices.com/sponsor" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-12 sm:py-16 lg:py-20">
        {/* Full hero background icon */}
        <img
          src="/Trust icon.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[4] -translate-x-[8%]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Sponsor & CRO Services
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Accelerate your clinical trials with our comprehensive recruitment and site management solutions
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Request Proposal
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Study Solutions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From protocol development to study closeout, we provide end-to-end support for your clinical trials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sponsorServices.map((service, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TRUST?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proven results and industry expertise to drive your study success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-900 font-medium">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Accelerate Your Study?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how TRUST can help you meet your enrollment goals and timeline requirements
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>

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
    </>
  );
};

export default SponsorLanding;
