import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import JobDetailModal from '../components/JobDetailModal';

const JobSearch = () => {
  const [filters, setFilters] = useState({
    keywords: '',
    remoteOnly: false,
    teams: [],
    regions: [],
    locations: []
  });
  
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const teams = [
    'Clinical Research',
    'Clinical Operations',
    'Regulatory Affairs',
    'Quality Assurance',
    'Data Management',
    'Project Management',
    'Business Development',
    'Training & Development'
  ];

  const regions = [
    'United States',
    'Europe',
    'Canada',
    'South America',
    'Asia Pacific'
  ];

  const locations = [
    'Remote',
    'New York, NY',
    'Boston, MA',
    'Philadelphia, PA',
    'Chicago, IL',
    'San Francisco, CA',
    'London, UK',
    'Frankfurt, Germany',
    'Paris, France',
    'Amsterdam, Netherlands',
    'Toronto, Canada',
    'Vancouver, Canada',
    'São Paulo, Brazil',
    'Buenos Aires, Argentina',
    'Santiago, Chile',
    'Bogotá, Colombia',
    'Lima, Peru',
    'Mexico City, Mexico'
  ];

  const jobs = [
    // US REGION - 4 positions
    {
      id: 1,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'United States',
      location: 'New York, NY',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 2,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'United States',
      location: 'Boston, MA',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 3,
      title: 'Senior Clinical Research Associate (Sr CRA)',
      team: 'Clinical Research',
      region: 'United States',
      location: 'Philadelphia, PA',
      description: 'Lead and mentor CRA team members while managing complex clinical trials and ensuring high-quality monitoring activities.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '5+ years of clinical research experience',
        'Previous CRA experience with leadership responsibilities',
        'Advanced knowledge of ICH-GCP guidelines',
        'Strong mentoring and training skills',
        'Ability to travel up to 70% of the time'
      ],
      responsibilities: [
        'Lead and mentor junior CRA team members',
        'Manage complex, high-risk clinical trials',
        'Conduct advanced monitoring activities',
        'Train new CRAs on protocols and procedures',
        'Serve as subject matter expert for clinical operations',
        'Collaborate with study teams and stakeholders'
      ]
    },
    {
      id: 4,
      title: 'Clinical Trial Lead',
      team: 'Clinical Operations',
      region: 'United States',
      location: 'Chicago, IL',
      description: 'Lead clinical trial execution from start to finish, managing study teams and ensuring successful study completion.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '7+ years of clinical research experience',
        'Previous experience managing clinical trials',
        'Strong project management skills',
        'Knowledge of regulatory requirements',
        'Leadership and team management experience'
      ],
      responsibilities: [
        'Lead clinical trial execution and management',
        'Manage study teams and coordinate activities',
        'Ensure study milestones are met on time and within budget',
        'Oversee study documentation and regulatory compliance',
        'Communicate with sponsors and stakeholders',
        'Manage study risks and implement mitigation strategies'
      ]
    },
    {
      id: 5,
      title: 'Senior Clinical Trial Manager',
      team: 'Clinical Operations',
      region: 'United States',
      location: 'San Francisco, CA',
      description: 'Manage multiple clinical trials across different regions and therapeutic indications, providing strategic oversight and leadership.',
      requirements: [
        'Master\'s degree in life sciences or related field preferred',
        '10+ years of clinical research experience',
        'Previous experience managing multiple trials',
        'Experience across different therapeutic areas',
        'Strong strategic thinking and leadership skills',
        'International clinical trial experience'
      ],
      responsibilities: [
        'Manage portfolio of clinical trials across multiple regions',
        'Provide strategic oversight for different therapeutic indications',
        'Lead cross-functional study teams',
        'Develop and implement clinical trial strategies',
        'Manage relationships with key stakeholders globally',
        'Ensure compliance across different regulatory jurisdictions',
        'Mentor and develop clinical operations staff'
      ]
    },
    {
      id: 6,
      title: 'Clinical Trial Nurse',
      team: 'Clinical Research',
      region: 'United States',
      location: 'Remote',
      description: 'Conduct clinical trial subject evaluations, patient assessments, and coordinate with study sites for participant care.',
      requirements: [
        'Registered Nurse (RN) license',
        'Bachelor\'s degree in Nursing preferred',
        '3+ years of clinical nursing experience',
        'Experience in clinical research or trials',
        'Knowledge of ICH-GCP guidelines',
        'Strong patient assessment skills'
      ],
      responsibilities: [
        'Conduct comprehensive subject evaluations',
        'Perform patient assessments and vital signs monitoring',
        'Coordinate with study sites for participant care',
        'Document clinical findings and adverse events',
        'Ensure protocol compliance in patient care',
        'Communicate with investigators and study coordinators'
      ]
    },

    // CANADA REGION - 2 positions
    {
      id: 7,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'Canada',
      location: 'Toronto, Canada',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 8,
      title: 'Clinical Trial Nurse',
      team: 'Clinical Research',
      region: 'Canada',
      location: 'Vancouver, Canada',
      description: 'Conduct clinical trial subject evaluations, patient assessments, and coordinate with study sites for participant care.',
      requirements: [
        'Registered Nurse (RN) license',
        'Bachelor\'s degree in Nursing preferred',
        '3+ years of clinical nursing experience',
        'Experience in clinical research or trials',
        'Knowledge of ICH-GCP guidelines',
        'Strong patient assessment skills'
      ],
      responsibilities: [
        'Conduct comprehensive subject evaluations',
        'Perform patient assessments and vital signs monitoring',
        'Coordinate with study sites for participant care',
        'Document clinical findings and adverse events',
        'Ensure protocol compliance in patient care',
        'Communicate with investigators and study coordinators'
      ]
    },

    // EUROPE REGION - Multiple positions across EU countries
    {
      id: 9,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'London, UK',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 10,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'Frankfurt, Germany',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 11,
      title: 'Senior Clinical Research Associate (Sr CRA)',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'Paris, France',
      description: 'Lead and mentor CRA team members while managing complex clinical trials and ensuring high-quality monitoring activities.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '5+ years of clinical research experience',
        'Previous CRA experience with leadership responsibilities',
        'Advanced knowledge of ICH-GCP guidelines',
        'Strong mentoring and training skills',
        'Ability to travel up to 70% of the time'
      ],
      responsibilities: [
        'Lead and mentor junior CRA team members',
        'Manage complex, high-risk clinical trials',
        'Conduct advanced monitoring activities',
        'Train new CRAs on protocols and procedures',
        'Serve as subject matter expert for clinical operations',
        'Collaborate with study teams and stakeholders'
      ]
    },
    {
      id: 12,
      title: 'Clinical Trial Lead',
      team: 'Clinical Operations',
      region: 'Europe',
      location: 'Amsterdam, Netherlands',
      description: 'Lead clinical trial execution from start to finish, managing study teams and ensuring successful study completion.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '7+ years of clinical research experience',
        'Previous experience managing clinical trials',
        'Strong project management skills',
        'Knowledge of regulatory requirements',
        'Leadership and team management experience'
      ],
      responsibilities: [
        'Lead clinical trial execution and management',
        'Manage study teams and coordinate activities',
        'Ensure study milestones are met on time and within budget',
        'Oversee study documentation and regulatory compliance',
        'Communicate with sponsors and stakeholders',
        'Manage study risks and implement mitigation strategies'
      ]
    },
    {
      id: 13,
      title: 'Senior Clinical Trial Manager',
      team: 'Clinical Operations',
      region: 'Europe',
      location: 'Barcelona, Spain',
      description: 'Manage multiple clinical trials across different regions and therapeutic indications, providing strategic oversight and leadership.',
      requirements: [
        'Master\'s degree in life sciences or related field preferred',
        '10+ years of clinical research experience',
        'Previous experience managing multiple trials',
        'Experience across different therapeutic areas',
        'Strong strategic thinking and leadership skills',
        'International clinical trial experience'
      ],
      responsibilities: [
        'Manage portfolio of clinical trials across multiple regions',
        'Provide strategic oversight for different therapeutic indications',
        'Lead cross-functional study teams',
        'Develop and implement clinical trial strategies',
        'Manage relationships with key stakeholders globally',
        'Ensure compliance across different regulatory jurisdictions',
        'Mentor and develop clinical operations staff'
      ]
    },
    {
      id: 14,
      title: 'Clinical Trial Nurse',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'Berlin, Germany',
      description: 'Conduct clinical trial subject evaluations, patient assessments, and coordinate with study sites for participant care.',
      requirements: [
        'Registered Nurse (RN) license',
        'Bachelor\'s degree in Nursing preferred',
        '3+ years of clinical nursing experience',
        'Experience in clinical research or trials',
        'Knowledge of ICH-GCP guidelines',
        'Strong patient assessment skills'
      ],
      responsibilities: [
        'Conduct comprehensive subject evaluations',
        'Perform patient assessments and vital signs monitoring',
        'Coordinate with study sites for participant care',
        'Document clinical findings and adverse events',
        'Ensure protocol compliance in patient care',
        'Communicate with investigators and study coordinators'
      ]
    },
    {
      id: 15,
      title: 'Clinical Trial Nurse',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'Rome, Italy',
      description: 'Conduct clinical trial subject evaluations, patient assessments, and coordinate with study sites for participant care.',
      requirements: [
        'Registered Nurse (RN) license',
        'Bachelor\'s degree in Nursing preferred',
        '3+ years of clinical nursing experience',
        'Experience in clinical research or trials',
        'Knowledge of ICH-GCP guidelines',
        'Strong patient assessment skills'
      ],
      responsibilities: [
        'Conduct comprehensive subject evaluations',
        'Perform patient assessments and vital signs monitoring',
        'Coordinate with study sites for participant care',
        'Document clinical findings and adverse events',
        'Ensure protocol compliance in patient care',
        'Communicate with investigators and study coordinators'
      ]
    },
    {
      id: 16,
      title: 'Clinical Trial Nurse',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'Stockholm, Sweden',
      description: 'Conduct clinical trial subject evaluations, patient assessments, and coordinate with study sites for participant care.',
      requirements: [
        'Registered Nurse (RN) license',
        'Bachelor\'s degree in Nursing preferred',
        '3+ years of clinical nursing experience',
        'Experience in clinical research or trials',
        'Knowledge of ICH-GCP guidelines',
        'Strong patient assessment skills'
      ],
      responsibilities: [
        'Conduct comprehensive subject evaluations',
        'Perform patient assessments and vital signs monitoring',
        'Coordinate with study sites for participant care',
        'Document clinical findings and adverse events',
        'Ensure protocol compliance in patient care',
        'Communicate with investigators and study coordinators'
      ]
    },
    {
      id: 17,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'Copenhagen, Denmark',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 18,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'Europe',
      location: 'Zurich, Switzerland',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },

    // SOUTH AMERICA REGION - Multiple positions across South American countries
    {
      id: 19,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'South America',
      location: 'São Paulo, Brazil',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time',
        'Fluent in Portuguese and English'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 20,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'South America',
      location: 'Buenos Aires, Argentina',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time',
        'Fluent in Spanish and English'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    },
    {
      id: 21,
      title: 'Senior Clinical Research Associate (Sr CRA)',
      team: 'Clinical Research',
      region: 'South America',
      location: 'Santiago, Chile',
      description: 'Lead and mentor CRA team members while managing complex clinical trials and ensuring high-quality monitoring activities.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '5+ years of clinical research experience',
        'Previous CRA experience with leadership responsibilities',
        'Advanced knowledge of ICH-GCP guidelines',
        'Strong mentoring and training skills',
        'Ability to travel up to 70% of the time',
        'Fluent in Spanish and English'
      ],
      responsibilities: [
        'Lead and mentor junior CRA team members',
        'Manage complex, high-risk clinical trials',
        'Conduct advanced monitoring activities',
        'Train new CRAs on protocols and procedures',
        'Serve as subject matter expert for clinical operations',
        'Collaborate with study teams and stakeholders'
      ]
    },
    {
      id: 22,
      title: 'Clinical Trial Lead',
      team: 'Clinical Operations',
      region: 'South America',
      location: 'Bogotá, Colombia',
      description: 'Lead clinical trial execution from start to finish, managing study teams and ensuring successful study completion.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '7+ years of clinical research experience',
        'Previous experience managing clinical trials',
        'Strong project management skills',
        'Knowledge of regulatory requirements',
        'Leadership and team management experience',
        'Fluent in Spanish and English'
      ],
      responsibilities: [
        'Lead clinical trial execution and management',
        'Manage study teams and coordinate activities',
        'Ensure study milestones are met on time and within budget',
        'Oversee study documentation and regulatory compliance',
        'Communicate with sponsors and stakeholders',
        'Manage study risks and implement mitigation strategies'
      ]
    },
    {
      id: 23,
      title: 'Senior Clinical Trial Manager',
      team: 'Clinical Operations',
      region: 'South America',
      location: 'Lima, Peru',
      description: 'Manage multiple clinical trials across different regions and therapeutic indications, providing strategic oversight and leadership.',
      requirements: [
        'Master\'s degree in life sciences or related field preferred',
        '10+ years of clinical research experience',
        'Previous experience managing multiple trials',
        'Experience across different therapeutic areas',
        'Strong strategic thinking and leadership skills',
        'International clinical trial experience',
        'Fluent in Spanish and English'
      ],
      responsibilities: [
        'Manage portfolio of clinical trials across multiple regions',
        'Provide strategic oversight for different therapeutic indications',
        'Lead cross-functional study teams',
        'Develop and implement clinical trial strategies',
        'Manage relationships with key stakeholders globally',
        'Ensure compliance across different regulatory jurisdictions',
        'Mentor and develop clinical operations staff'
      ]
    },
    {
      id: 24,
      title: 'Clinical Trial Nurse',
      team: 'Clinical Research',
      region: 'South America',
      location: 'Mexico City, Mexico',
      description: 'Conduct clinical trial subject evaluations, patient assessments, and coordinate with study sites for participant care.',
      requirements: [
        'Registered Nurse (RN) license',
        'Bachelor\'s degree in Nursing preferred',
        '3+ years of clinical nursing experience',
        'Experience in clinical research or trials',
        'Knowledge of ICH-GCP guidelines',
        'Strong patient assessment skills',
        'Fluent in Spanish and English'
      ],
      responsibilities: [
        'Conduct comprehensive subject evaluations',
        'Perform patient assessments and vital signs monitoring',
        'Coordinate with study sites for participant care',
        'Document clinical findings and adverse events',
        'Ensure protocol compliance in patient care',
        'Communicate with investigators and study coordinators'
      ]
    },
    {
      id: 25,
      title: 'Clinical Trial Nurse',
      team: 'Clinical Research',
      region: 'South America',
      location: 'São Paulo, Brazil',
      description: 'Conduct clinical trial subject evaluations, patient assessments, and coordinate with study sites for participant care.',
      requirements: [
        'Registered Nurse (RN) license',
        'Bachelor\'s degree in Nursing preferred',
        '3+ years of clinical nursing experience',
        'Experience in clinical research or trials',
        'Knowledge of ICH-GCP guidelines',
        'Strong patient assessment skills',
        'Fluent in Portuguese and English'
      ],
      responsibilities: [
        'Conduct comprehensive subject evaluations',
        'Perform patient assessments and vital signs monitoring',
        'Coordinate with study sites for participant care',
        'Document clinical findings and adverse events',
        'Ensure protocol compliance in patient care',
        'Communicate with investigators and study coordinators'
      ]
    },
    {
      id: 26,
      title: 'Clinical Research Associate (CRA)',
      team: 'Clinical Research',
      region: 'South America',
      location: 'Buenos Aires, Argentina',
      description: 'Monitor clinical trials and ensure compliance with protocols, regulations, and Good Clinical Practice (GCP) standards.',
      requirements: [
        'Bachelor\'s degree in life sciences or related field',
        '2+ years of clinical research experience',
        'Knowledge of ICH-GCP guidelines',
        'Strong communication and organizational skills',
        'Ability to travel up to 60% of the time',
        'Fluent in Spanish and English'
      ],
      responsibilities: [
        'Conduct site visits and monitoring activities',
        'Review study documents and data',
        'Ensure protocol compliance',
        'Maintain study files and documentation',
        'Communicate with study sites and sponsors'
      ]
    }
  ];

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'keywords' || filterType === 'remoteOnly') {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
      }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      keywords: '',
      remoteOnly: false,
      teams: [],
      regions: [],
      locations: []
    });
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.keywords && !job.title.toLowerCase().includes(filters.keywords.toLowerCase())) {
      return false;
    }
    if (filters.remoteOnly && job.location !== 'Remote') {
      return false;
    }
    if (filters.teams.length > 0 && !filters.teams.includes(job.team)) {
      return false;
    }
    if (filters.regions.length > 0 && !filters.regions.includes(job.region)) {
      return false;
    }
    if (filters.locations.length > 0 && !filters.locations.includes(job.location)) {
      return false;
    }
    return true;
  });

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleJobApplicationSuccess = () => {
    setShowJobDetail(false);
    alert('Thank you for your application! We will review it and get back to you soon.');
  };

  return (
    <>
      <Helmet>
        <title>Search Jobs - TRUST Clinical Services</title>
        <meta name="description" content="Search and apply for clinical research positions at TRUST Clinical Services. Find opportunities for CRA, Clinical Trial Lead, and Senior Clinical Trial Manager roles." />
        <link rel="canonical" href="https://trustclinicalservices.com/jobs" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Search Jobs</h1>
                <p className="text-gray-600 mt-2">Find your next career opportunity at TRUST Clinical Services</p>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Team collaboration"
                  className="w-32 h-24 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h2>
                
                {/* Keywords */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={filters.keywords}
                    onChange={(e) => handleFilterChange('keywords', e.target.value)}
                    placeholder="Keyword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Remote Only */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remoteOnly}
                      onChange={(e) => handleFilterChange('remoteOnly', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show remote jobs only</span>
                  </label>
                </div>

                {/* Teams */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Teams</h3>
                  <div className="space-y-2">
                    {teams.map(team => (
                      <label key={team} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.teams.includes(team)}
                          onChange={() => handleFilterChange('teams', team)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{team}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Regions */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Regions</h3>
                  <div className="space-y-2">
                    {regions.map(region => (
                      <label key={region} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.regions.includes(region)}
                          onChange={() => handleFilterChange('regions', region)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearAllFilters}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all active filters
                </button>
              </div>
            </div>

            {/* Right Content - Job Results */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filteredJobs.length} Results
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredJobs.map(job => (
                        <tr 
                          key={job.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleJobClick(job)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.team}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.region}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              {job.location === 'Remote' ? (
                                <span className="inline-flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  Remote
                                </span>
                              ) : (
                                <span className="inline-flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  {job.location}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={showJobDetail}
        onClose={() => setShowJobDetail(false)}
        job={selectedJob}
        onSuccess={handleJobApplicationSuccess}
      />
    </>
  );
};

export default JobSearch;
