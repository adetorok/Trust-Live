const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 text-center">
              About TRACS
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 mb-8 text-center">
                Trial Recruitment and Clinical Services - Your trusted partner in accelerating clinical trial enrollment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                  <p className="text-slate-600 mb-6">
                    To revolutionize clinical trial recruitment by combining human-centered outreach with rigorous clinical expertise, 
                    ensuring faster enrollment and higher quality participant engagement.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
                  <p className="text-slate-600 mb-6">
                    To become the leading recruitment partner that sponsors and sites trust to deliver predictable, 
                    high-quality enrollment results across all therapeutic areas.
                  </p>
                </div>
              </div>
              
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Why We're Different</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-teal-50 rounded-lg">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Human-First Approach</h3>
                    <p className="text-slate-600">
                      We believe in face-to-face engagement and building genuine relationships with potential participants.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-teal-50 rounded-lg">
                    <div className="text-4xl mb-4">🩺</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Clinical Expertise</h3>
                    <p className="text-slate-600">
                      Our licensed nurses ensure every lead is properly pre-screened against protocol criteria.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-teal-50 rounded-lg">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Proven Results</h3>
                    <p className="text-slate-600">
                      Our high-touch model consistently delivers superior enrollment rates compared to digital-only approaches.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Team</h2>
                <p className="text-slate-600 mb-6">
                  TRACS is led by a team of experienced clinical research professionals, including former site coordinators, 
                  clinical operations managers, and recruitment specialists. Our diverse backgrounds give us unique insights 
                  into the challenges faced by both sponsors and sites.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Clinical Operations</h3>
                    <p className="text-slate-600">
                      Our clinical team includes licensed nurses, former coordinators, and regulatory specialists 
                      who understand the complexities of clinical trial protocols.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Community Outreach</h3>
                    <p className="text-slate-600">
                      Our outreach specialists are trained in community engagement and have deep connections 
                      across diverse populations and geographic regions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Commitment</h2>
                <div className="bg-teal-50 p-8 rounded-lg">
                  <p className="text-lg text-slate-700 mb-4">
                    We are committed to maintaining the highest standards of ethical recruitment practices, 
                    ensuring participant safety, and delivering transparent, data-driven results to our partners.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-2">
                    <li>Full compliance with FDA guidelines and IRB requirements</li>
                    <li>Transparent reporting and regular communication</li>
                    <li>Respect for participant privacy and informed consent</li>
                    <li>Continuous improvement based on feedback and data</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Work Together?</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Let's discuss how TRACS can help accelerate your clinical trial enrollment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/sponsor" 
                    className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Sponsor Solutions
                  </a>
                  <a 
                    href="/site" 
                    className="bg-white text-teal-600 border border-teal-600 font-semibold px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    Site Solutions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Get Your Custom Proposal</h2>
            <p className="text-lg text-slate-600 mt-2">
              Ready to see how TRACS can transform your clinical trial recruitment? 
              Request a personalized proposal tailored to your organization's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sponsor Quote */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sponsor / CRO Solutions</h3>
                <p className="text-slate-600">
                  Portfolio-wide recruitment strategies with centralized management and multi-site coordination.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm text-slate-600 space-y-2">
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Scalable multi-site outreach campaigns</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Centralized nurse-led pre-screening</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Portfolio-wide IRB support</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Transparent project management</span>
                  </div>
                </div>
                <a 
                  href="/sponsor" 
                  className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-teal-700 transition-colors text-center block"
                >
                  Request Sponsor Proposal
                </a>
              </div>
            </div>

            {/* Site Quote */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Site / Vendor Solutions</h3>
                <p className="text-slate-600">
                  End-to-end recruitment support designed specifically for clinical research sites.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm text-slate-600 space-y-2">
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Community outreach and engagement</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Nurse-led subject qualification</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>IRB documentation support</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Study-specific landing pages</span>
                  </div>
                </div>
                <a 
                  href="/site" 
                  className="w-full bg-white text-teal-600 border border-teal-600 font-semibold py-3 px-6 rounded-md hover:bg-teal-50 transition-colors text-center block"
                >
                  Request Site Proposal
                </a>
              </div>
            </div>
          </div>

          {/* Unified Quote Option */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl border-2 border-teal-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Not Sure Which Solution Fits?</h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Our team can help you determine the best approach for your specific needs. 
                  Start with a general inquiry and we'll guide you to the right solution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact" 
                    className="bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Start with General Inquiry
                  </a>
                  <a 
                    href="tel:+19735551234" 
                    className="bg-white text-teal-600 border border-teal-600 font-semibold py-3 px-8 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    Call (973) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Prefer to Talk First?</h3>
            <p className="text-slate-600 mb-6">
              Our clinical recruitment specialists are ready to discuss your specific challenges and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-slate-600">
              <div className="flex items-center">
                <span className="text-teal-600 mr-2">📧</span>
                <a href="mailto:contact@tracs-recruitment.com" className="hover:text-teal-600">
                  contact@tracs-recruitment.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-teal-600 mr-2">📞</span>
                <a href="tel:+19735551234" className="hover:text-teal-600">
                  (973) 555-1234
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-teal-600 mr-2">📍</span>
                <span>Newark, NJ</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

