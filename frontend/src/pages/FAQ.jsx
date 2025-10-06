import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

const FAQ = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [enhancedFormType, setEnhancedFormType] = useState('sponsor');

  const handleGetStartedClick = () => {
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

  const faqs = [
    {
      question: "What is TRUST Clinical Services?",
      answer: "TRUST Clinical Services is a comprehensive clinical trial recruitment platform that connects sponsors, CROs, clinical sites, and vendors to streamline the participant recruitment process. We specialize in nurse-led pre-screening, community outreach, and IRB-ready materials to accelerate enrollment timelines."
    },
    {
      question: "How does the recruitment process work?",
      answer: "Our process begins with targeted community outreach using IRB-approved materials. We then conduct nurse-led pre-screening to identify eligible participants, significantly reducing screen-fail rates. This allows study coordinators to focus on qualified visits rather than initial screening."
    },
    {
      question: "What types of studies do you support?",
      answer: "We support a wide range of clinical trials across all therapeutic areas, including but not limited to oncology, cardiology, neurology, gastroenterology, and rare diseases. Our platform is designed to handle studies of any size, from Phase I to Phase IV trials."
    },
    {
      question: "How do you ensure participant privacy and data security?",
      answer: "We are fully compliant with HIPAA, GDPR, and ICH-GCP guidelines. All participant data is encrypted and stored securely. We maintain strict access controls and conduct regular security audits to ensure the highest level of data protection."
    },
    {
      question: "What is included in your IRB-ready materials?",
      answer: "Our IRB-ready package includes bilingual flyers, brochures, landing pages, and digital marketing materials. All materials are pre-approved by our IRB and can be customized for your specific study requirements and target demographics."
    },
    {
      question: "How do you measure recruitment success?",
      answer: "We track key performance indicators including enrollment rates, screen-fail ratios, time-to-enrollment, and cost-per-participant. Our dashboard provides real-time analytics and reporting to help you monitor study progress and make data-driven decisions."
    },
    {
      question: "What support do you provide to clinical sites?",
      answer: "We provide comprehensive support including site training, marketing materials, participant pre-screening, and ongoing consultation. Our team works closely with site coordinators to ensure smooth study execution and optimal participant experience."
    },
    {
      question: "How quickly can you start recruitment for a new study?",
      answer: "We can typically begin recruitment activities within 2-4 weeks of study initiation. This includes IRB approval of materials, site training, and launch of community outreach campaigns. Rush timelines can be accommodated for urgent studies."
    },
    {
      question: "Do you work with international studies?",
      answer: "Yes, we support both domestic and international clinical trials. Our platform is designed to handle multi-country studies with appropriate regulatory compliance for each jurisdiction. We have experience working with studies across North America, Europe, and Asia-Pacific regions."
    },
    {
      question: "What makes TRUST different from other recruitment companies?",
      answer: "TRUST combines cutting-edge technology with personalized service. Our nurse-led pre-screening process, comprehensive IRB-ready materials, and real-time analytics platform provide a complete solution that reduces costs, accelerates timelines, and improves study success rates."
    }
  ];

  return (
    <div className={showRoleModal ? 'pointer-events-none' : ''}>
      <Helmet>
        <title>Frequently Asked Questions - TRUST Clinical Services</title>
        <meta name="description" content="Get answers to common questions about TRUST Clinical Services' clinical trial recruitment platform, services, and processes." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
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
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Everything you need to know about TRUST Clinical Services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help. Contact us for personalized assistance with your clinical trial recruitment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStartedClick}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
                <a
                  href="mailto:info@trustclinicalservices.com"
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
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

export default FAQ;
