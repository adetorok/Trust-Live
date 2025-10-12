import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import JobApplicationModal from '../components/JobApplicationModal';

const Career = () => {
  const [showJobApplicationModal, setShowJobApplicationModal] = useState(false);

  const handleApplyNowClick = () => {
    setShowJobApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowJobApplicationModal(false);
    // You can add success handling here if needed
    alert('Thank you for your application! We will review it and get back to you soon.');
  };

  const careerOpportunities = [
    {
      title: "Clinical Research Coordinators",
      description: "Lead patient recruitment and study coordination at our clinical sites.",
      features: [
        "Patient screening and enrollment",
        "Study protocol compliance",
        "Data collection and management",
        "Regulatory documentation"
      ],
      icon: "👩‍⚕️"
    },
    {
      title: "Business Development",
      description: "Build relationships with sponsors and CROs to expand our partnerships.",
      features: [
        "Client relationship management",
        "Proposal development",
        "Market analysis",
        "Strategic partnerships"
      ],
      icon: "🤝"
    },
    {
      title: "Technology & Innovation",
      description: "Develop cutting-edge solutions to improve clinical trial efficiency.",
      features: [
        "Software development",
        "Data analytics",
        "Process optimization",
        "Technology integration"
      ],
      icon: "💻"
    },
    {
      title: "Operations & Management",
      description: "Ensure smooth operations across all our clinical sites and studies.",
      features: [
        "Project management",
        "Quality assurance",
        "Process improvement",
        "Team leadership"
      ],
      icon: "📊"
    }
  ];

  const benefits = [
    "Competitive salary and comprehensive benefits",
    "Flexible work arrangements and remote options",
    "Professional development and training opportunities",
    "Health, dental, and vision insurance",
    "401(k) retirement plan with company matching",
    "Paid time off and holidays",
    "Career advancement opportunities",
    "Work-life balance initiatives"
  ];

  const values = [
    {
      title: "Innovation",
      description: "We embrace new technologies and methodologies to improve clinical research outcomes.",
      icon: "🚀"
    },
    {
      title: "Collaboration",
      description: "We work together as a team to achieve common goals and support each other's success.",
      icon: "🤝"
    },
    {
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from patient care to data quality.",
      icon: "⭐"
    },
    {
      title: "Growth",
      description: "We invest in our people's professional development and career advancement.",
      icon: "📈"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Careers - TRUST Clinical Services</title>
        <meta name="description" content="Join TRUST Clinical Services and help accelerate clinical research. Explore career opportunities in clinical research, business development, technology, and operations." />
        <link rel="canonical" href="https://trustclinicalservices.com/career" />
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
            Join Our Team
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-10">
            Help us accelerate clinical research and bring life-changing treatments to patients worldwide
          </p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg inline-block"
          >
            Search Jobs
          </Link>
        </div>
      </section>

      {/* Work Culture Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Work Where It's Best for You</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe in flexible work arrangements that allow our team members to thrive both professionally and personally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Remote Work</h3>
              <p className="text-gray-600">Work from anywhere with flexible schedules that fit your lifestyle</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Environment</h3>
              <p className="text-gray-600">Join a supportive team that values open communication and mutual respect</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Learning</h3>
              <p className="text-gray-600">Access to training, conferences, and professional development opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your New Role</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore exciting career opportunities across different departments and specialties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careerOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{opportunity.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{opportunity.title}</h3>
                <p className="text-gray-600 mb-4">{opportunity.description}</p>
                <ul className="space-y-2">
                  {opportunity.features.map((feature, featureIndex) => (
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

      {/* Company Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide our work and shape our culture
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
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive benefits to support our team members' health, well-being, and professional growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Company Stats */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Growing Team</h2>
            <p className="text-blue-100">
              Be part of a company that's making a real difference in clinical research
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-blue-100">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">25+</div>
              <div className="text-blue-100">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Employee Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our team and help us accelerate clinical research while building a rewarding career
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-center"
            >
              Search Jobs
            </Link>
            <button
              onClick={handleApplyNowClick}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              General Application
            </button>
          </div>
        </div>
      </section>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={showJobApplicationModal}
        onClose={() => setShowJobApplicationModal(false)}
        onSuccess={handleApplicationSuccess}
      />
    </>
  );
};

export default Career;
