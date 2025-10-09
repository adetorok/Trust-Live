import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

const Organization = () => {
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

  

  const values = [
    {
      title: "Trust & Transparency",
      description: "We believe in open communication and honest partnerships with all stakeholders in the clinical research ecosystem.",
      icon: "🤝"
    },
    {
      title: "Innovation & Excellence",
      description: "We continuously innovate to improve recruitment efficiency and participant experience through technology and process optimization.",
      icon: "🚀"
    },
    {
      title: "Patient-Centric Approach",
      description: "Every decision we make prioritizes the safety, comfort, and dignity of clinical trial participants.",
      icon: "❤️"
    },
    {
      title: "Regulatory Excellence",
      description: "We maintain the highest standards of compliance with ICH-GCP, HIPAA, and all applicable regulations.",
      icon: "⚖️"
    }
  ];

  return (
    <div className={showRoleModal ? 'pointer-events-none' : ''}>
      <Helmet>
        <title>Our Organization - TRUST Clinical Services</title>
        <meta name="description" content="Learn about TRUST Clinical Services' leadership team, company values, and commitment to advancing clinical research through innovative recruitment solutions." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-blue-50 py-12 sm:py-16 lg:py-20">
        {/* Full hero background icon */}
        <img
          src={`${import.meta.env.BASE_URL}Trust icon.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[4] -translate-x-[8%]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Our Organization
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Committed to advancing clinical research through innovation and excellence
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To accelerate clinical research by connecting the right participants with the right studies through innovative technology, 
                nurse-led pre-screening, and community outreach. We believe every patient deserves access to cutting-edge treatments 
                and every study deserves timely, quality enrollment.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To become the global leader in clinical trial recruitment, transforming how studies are conducted by making 
                participant identification faster, more efficient, and more accessible. We envision a future where no promising 
                therapy is delayed due to recruitment challenges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      

      {/* Company Stats */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-blue-100">
              Numbers that reflect our commitment to clinical research excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Studies Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">Participants Screened</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-blue-100">Clinical Sites</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Enrollment Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join the growing number of sponsors, CROs, and sites who trust us with their recruitment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRequestProposalClick}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Request Proposal
            </button>
            <button
              onClick={() => {
                // Scroll to footer contact section
                const contactSection = document.querySelector('#contact-section');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Our Team
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

export default Organization;
