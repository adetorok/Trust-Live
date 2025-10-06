import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

const SiteLanding = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [enhancedFormType, setEnhancedFormType] = useState('site');

  const handleRequestProposalClick = () => {
    // Since we're on the site page, directly open the site form
    setEnhancedFormType('site');
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

  const siteServices = [
    {
      title: "Patient Recruitment Support",
      description: "Comprehensive recruitment services to help you meet enrollment targets with pre-qualified, motivated participants.",
      features: [
        "Local community outreach campaigns",
        "Nurse-led pre-screening interviews",
        "Patient education and engagement",
        "Appointment scheduling assistance"
      ],
      icon: "👥"
    },
    {
      title: "Study Coordinator Training",
      description: "Professional development programs to enhance your team's capabilities and ensure study success.",
      features: [
        "ICH-GCP certification training",
        "Protocol-specific training modules",
        "Data management best practices",
        "Ongoing support and mentoring"
      ],
      icon: "🎓"
    },
    {
      title: "Regulatory Documentation",
      description: "Streamlined regulatory support to keep your studies compliant and on track.",
      features: [
        "IRB submission assistance",
        "Regulatory document preparation",
        "Compliance monitoring",
        "Audit support and preparation"
      ],
      icon: "📄"
    },
    {
      title: "Technology & Tools",
      description: "Access to cutting-edge technology and tools to streamline your study operations.",
      features: [
        "Electronic data capture systems",
        "Patient management platforms",
        "Real-time reporting dashboards",
        "Mobile data collection tools"
      ],
      icon: "💻"
    }
  ];

  const benefits = [
    "Increase patient enrollment by 50%",
    "Reduce administrative burden by 40%",
    "Access to diverse patient populations",
    "Streamlined regulatory processes",
    "Professional development opportunities",
    "Dedicated support team"
  ];

  const testimonials = [
    {
      quote: "TRUST helped us exceed our enrollment targets by 60% in our oncology study. Their pre-screening process was incredibly effective.",
      author: "Dr. Sarah Mitchell",
      title: "Principal Investigator, City Medical Center"
    },
    {
      quote: "The training and support from TRUST transformed our study coordination capabilities. Highly recommend their services.",
      author: "Jennifer Chen",
      title: "Study Coordinator, Regional Hospital"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Site & Vendor Services - TRUST Clinical Services</title>
        <meta name="description" content="Comprehensive clinical trial support for research sites and vendors. Enhance your capabilities and accelerate patient enrollment with TRUST." />
        <link rel="canonical" href="https://trustclinicalservices.com/site" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-cyan-50 py-12 sm:py-16 lg:py-20">
        {/* Full hero background icon */}
        <img
          src={`${import.meta.env.BASE_URL}Trust icon.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[4] -translate-x-[8%]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Site & Vendor Services
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Enhance your research capabilities and accelerate patient enrollment with our comprehensive site support services
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg"
          >
            Request Proposal
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Site Support</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From patient recruitment to regulatory compliance, we provide everything you need to succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteServices.map((service, index) => (
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner with TRUST?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proven results and comprehensive support to enhance your research capabilities
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

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Partners Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from research sites that have transformed their capabilities with TRUST
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <blockquote className="text-lg text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-l-4 border-teal-500 pl-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Enhance Your Research?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join our network of successful research sites and start accelerating your patient enrollment today
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Join Our Network
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

export default SiteLanding;
