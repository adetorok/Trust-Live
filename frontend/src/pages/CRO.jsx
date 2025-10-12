import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

const CRO = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [enhancedFormType, setEnhancedFormType] = useState('cro');

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
  };

  const croServices = [
    {
      title: "Full Service Clinical Trial Management",
      description: "End-to-end clinical trial execution from protocol development to regulatory submission and post-marketing support.",
      features: [
        "Protocol design and optimization",
        "Regulatory strategy and submissions",
        "Site identification and qualification",
        "Clinical monitoring and data management",
        "Safety and pharmacovigilance",
        "Biostatistics and medical writing"
      ],
      icon: "🏥"
    },
    {
      title: "Regulatory Affairs & Compliance",
      description: "Comprehensive regulatory support ensuring compliance with FDA, EMA, and global regulatory requirements.",
      features: [
        "IND/IDE submissions",
        "NDA/BLA preparation",
        "Regulatory strategy development",
        "FDA and EMA interactions",
        "Compliance monitoring",
        "Post-marketing surveillance"
      ],
      icon: "📋"
    },
    {
      title: "Data Management & Biostatistics",
      description: "Advanced data management and statistical analysis services to ensure data integrity and regulatory compliance.",
      features: [
        "Clinical data management",
        "Statistical analysis and reporting",
        "Database design and validation",
        "Data quality assurance",
        "Interim and final analyses",
        "Regulatory reporting"
      ],
      icon: "📊"
    },
    {
      title: "Project Management & Operations",
      description: "Dedicated project management ensuring timely delivery, quality outcomes, and cost-effective execution.",
      features: [
        "Project planning and execution",
        "Timeline and budget management",
        "Risk assessment and mitigation",
        "Vendor management",
        "Quality assurance oversight",
        "Stakeholder communication"
      ],
      icon: "🎯"
    },
    {
      title: "Medical Writing & Documentation",
      description: "Professional medical writing services for all clinical trial documentation and regulatory submissions.",
      features: [
        "Protocol development",
        "Clinical study reports",
        "Investigator brochures",
        "Informed consent forms",
        "Regulatory documents",
        "Publication support"
      ],
      icon: "📝"
    },
    {
      title: "Safety & Pharmacovigilance",
      description: "Comprehensive safety monitoring and pharmacovigilance services throughout the clinical trial lifecycle.",
      features: [
        "Adverse event reporting",
        "Safety database management",
        "Risk management plans",
        "DSMB support",
        "Safety signal detection",
        "Post-marketing safety"
      ],
      icon: "⚠️"
    }
  ];

  const croCapabilities = [
    "Phase I-IV clinical trials",
    "Oncology and rare disease expertise",
    "Global regulatory submissions",
    "Real-world evidence studies",
    "Post-marketing surveillance",
    "Medical device trials",
    "Digital health solutions",
    "Patient-reported outcomes"
  ];

  const therapeuticAreas = [
    {
      area: "Oncology",
      description: "Comprehensive oncology trial expertise including solid tumors, hematologic malignancies, and rare cancers.",
      icon: "🧬"
    },
    {
      area: "Rare Diseases",
      description: "Specialized experience in rare disease trials with patient-centric approaches and regulatory expertise.",
      icon: "🔬"
    },
    {
      area: "Cardiovascular",
      description: "Cardiovascular trial management including heart failure, arrhythmias, and interventional procedures.",
      icon: "❤️"
    },
    {
      area: "Neurology",
      description: "Neurological disorder trials including Alzheimer's, Parkinson's, multiple sclerosis, and stroke.",
      icon: "🧠"
    },
    {
      area: "Immunology",
      description: "Immune system disorder trials including autoimmune diseases, allergies, and inflammatory conditions.",
      icon: "🛡️"
    },
    {
      area: "Infectious Diseases",
      description: "Infectious disease trials including vaccines, antivirals, and antimicrobial resistance studies.",
      icon: "🦠"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Full Service CRO - TRUST Clinical Services</title>
        <meta name="description" content="Comprehensive Contract Research Organization services. Full-service clinical trial management from protocol development to regulatory submission." />
        <link rel="canonical" href="https://trustclinicalservices.com/cro" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-12 sm:py-16 lg:py-20">
        {/* Full hero background icon */}
        <img
          src={`${import.meta.env.BASE_URL}Trust icon.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none select-none transform origin-center scale-[4] -translate-x-[8%]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Full Service CRO
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Comprehensive Contract Research Organization services delivering end-to-end clinical trial solutions from concept to commercialization
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Request CRO Proposal
          </button>
        </div>
      </section>

      {/* CRO Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive CRO Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From protocol development to regulatory submission, we provide complete clinical trial solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {croServices.map((service, index) => (
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

      {/* Therapeutic Areas Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Therapeutic Expertise</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Deep therapeutic area expertise across multiple disease states
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {therapeuticAreas.map((area, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{area.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.area}</h3>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRO Capabilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">CRO Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive capabilities to support your clinical development needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {croCapabilities.map((capability, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-900 font-medium">{capability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose TRUST CRO Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose TRUST CRO?</h2>
            <p className="text-blue-100 max-w-3xl mx-auto">
              Proven expertise and commitment to delivering successful clinical trials
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-blue-100">Years CRO Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Clinical Trials Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">On-Time Delivery Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Partner with Our CRO?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how TRUST CRO can accelerate your clinical development program
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get CRO Proposal
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

export default CRO;
