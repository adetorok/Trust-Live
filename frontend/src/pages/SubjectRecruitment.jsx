import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RoleSelectionModal from '../components/RoleSelectionModal';
import EnhancedProposalForm from '../components/EnhancedProposalForm';

const SubjectRecruitment = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [enhancedFormType, setEnhancedFormType] = useState('recruitment');

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

  const recruitmentServices = [
    {
      title: "Strategic Patient Recruitment",
      description: "Comprehensive recruitment strategies designed to identify and enroll qualified participants efficiently.",
      features: [
        "Multi-channel recruitment campaigns",
        "Patient database mining",
        "Community outreach programs",
        "Digital marketing strategies",
        "Physician referral networks",
        "Patient advocacy partnerships"
      ],
      icon: "🎯"
    },
    {
      title: "Nurse-Led Pre-Screening",
      description: "Professional nurse-led pre-screening services to ensure high-quality participant identification and qualification.",
      features: [
        "Telephone pre-screening",
        "Medical history review",
        "Eligibility assessment",
        "Informed consent education",
        "Appointment scheduling",
        "Follow-up coordination"
      ],
      icon: "👩‍⚕️"
    },
    {
      title: "Site Support & Training",
      description: "Comprehensive site support services to optimize recruitment performance and study conduct.",
      features: [
        "Site training programs",
        "Recruitment toolkits",
        "Performance monitoring",
        "Best practice sharing",
        "Site coordinator support",
        "Quality improvement initiatives"
      ],
      icon: "🏥"
    },
    {
      title: "Patient Retention Programs",
      description: "Proven retention strategies to minimize dropout rates and maintain study integrity.",
      features: [
        "Patient engagement programs",
        "Retention incentives",
        "Communication strategies",
        "Appointment reminders",
        "Transportation assistance",
        "Patient support services"
      ],
      icon: "🤝"
    }
  ];

  const recruitmentCapabilities = [
    "Reduce enrollment timelines by up to 40%",
    "Lower screen-fail rates by 60%",
    "Access to diverse patient populations",
    "Real-time recruitment analytics",
    "Multi-language support",
    "Cultural competency programs",
    "Patient-centric approach",
    "Regulatory compliance expertise"
  ];

  const therapeuticSpecialties = [
    {
      specialty: "Oncology",
      description: "Specialized oncology recruitment with access to cancer patient networks and oncology centers.",
      icon: "🧬"
    },
    {
      specialty: "Rare Diseases",
      description: "Expert rare disease recruitment connecting patients with specialized treatment opportunities.",
      icon: "🔬"
    },
    {
      specialty: "Cardiovascular",
      description: "Cardiovascular trial recruitment with access to heart disease patient populations.",
      icon: "❤️"
    },
    {
      specialty: "Neurology",
      description: "Neurological disorder recruitment including Alzheimer's, Parkinson's, and MS patients.",
      icon: "🧠"
    },
    {
      specialty: "Pediatrics",
      description: "Pediatric recruitment expertise with family-centered approaches and specialized networks.",
      icon: "👶"
    },
    {
      specialty: "Mental Health",
      description: "Mental health trial recruitment with sensitivity to patient needs and privacy.",
      icon: "🧘"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Subject Recruitment & Retention - TRUST Clinical Services</title>
        <meta name="description" content="Expert patient recruitment and retention services. Accelerate enrollment with our proven strategies and nurse-led pre-screening programs." />
        <link rel="canonical" href="https://trustclinicalservices.com/recruitment" />
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
            Subject Recruitment & Retention
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Accelerate patient enrollment and minimize dropout rates with our proven recruitment strategies and retention programs
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg"
          >
            Request Recruitment Proposal
          </button>
        </div>
      </section>

      {/* Recruitment Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recruitment & Retention Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions to accelerate enrollment and maintain participant engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recruitmentServices.map((service, index) => (
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

      {/* Therapeutic Specialties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Therapeutic Specialties</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized recruitment expertise across multiple therapeutic areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {therapeuticSpecialties.map((specialty, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{specialty.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{specialty.specialty}</h3>
                <p className="text-gray-600">{specialty.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Capabilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recruitment Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proven results and capabilities that drive recruitment success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recruitmentCapabilities.map((capability, index) => (
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

      {/* Service Options Section */}
      <section className="py-16 bg-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Options</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the recruitment solution that best fits your study needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sponsor & CRO Services */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Sponsors & CROs</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive recruitment services for pharmaceutical companies and contract research organizations.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-3">✓</span>
                  Strategic recruitment planning
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-3">✓</span>
                  Multi-site coordination
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-3">✓</span>
                  Performance analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-3">✓</span>
                  Regulatory compliance
                </li>
              </ul>
              <a
                href="/sponsor"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Site & Vendor Services */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Sites & Vendors</h3>
              <p className="text-gray-600 mb-6">
                Site-specific recruitment support and vendor services to enhance your study performance.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-teal-500 mr-3">✓</span>
                  Site recruitment training
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-teal-500 mr-3">✓</span>
                  Local patient networks
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-teal-500 mr-3">✓</span>
                  Pre-screening support
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-teal-500 mr-3">✓</span>
                  Quality improvement
                </li>
              </ul>
              <a
                href="/site"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-teal-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Proven Recruitment Results</h2>
            <p className="text-teal-100 max-w-3xl mx-auto">
              Track record of successful recruitment across diverse therapeutic areas
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">40%</div>
              <div className="text-teal-100">Faster Enrollment</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">60%</div>
              <div className="text-teal-100">Lower Screen-Fail Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-teal-100">Clinical Sites</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-teal-100">Participants Screened</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Accelerate Your Recruitment?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how our recruitment services can help you meet your enrollment goals
          </p>
          <button
            onClick={handleRequestProposalClick}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg"
          >
            Get Recruitment Proposal
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

export default SubjectRecruitment;
