import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Sponsor } from '../models/Sponsor.js';
import { Site } from '../models/Site.js';
import { Study } from '../models/Study.js';
import { Milestone } from '../models/Milestone.js';
import { Participant } from '../models/Participant.js';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trust';

async function run() {
  await connectDB(MONGO_URI);
  console.log('🌱 Seeding database...');

  // Clear existing data (optional, for fresh seed)
  await Promise.all([
    User.deleteMany({}),
    Sponsor.deleteMany({}),
    Site.deleteMany({}),
    Study.deleteMany({}),
    Milestone.deleteMany({}),
    Participant.deleteMany({})
  ]);

  // Seed Admin User
  const adminEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@trust.com';
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || 'admin123';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await User.hashPassword(adminPassword);
    admin = await User.create({ 
      email: adminEmail, 
      name: 'Admin User', 
      passwordHash, 
      role: 'admin',
      isActive: true
    });
    console.log(`✅ Created admin: ${admin.email}`);
  } else {
    console.log(`ℹ️  Admin exists: ${admin.email}`);
  }

  // Seed Sponsor
  const sponsorEmail = process.env.DEMO_SPONSOR_EMAIL || 'sponsor@acmepharma.com';
  const sponsorPassword = process.env.DEMO_SPONSOR_PASSWORD || 'sponsor123';
  let acmePharma = await Sponsor.findOne({ name: 'ACME Pharmaceuticals' });
  if (!acmePharma) {
    acmePharma = await Sponsor.create({
      name: 'ACME Pharmaceuticals',
      companyEmail: 'contact@acmepharma.com',
      phone: '123-456-7890',
      address: {
        street: '100 Pharma Rd',
        city: 'Pharma City',
        state: 'PC',
        zip: '12345',
        country: 'US'
      },
      createdBy: admin._id
    });
    console.log(`✅ Created sponsor: ${acmePharma.name}`);
  } else {
    console.log(`ℹ️  Sponsor exists: ${acmePharma.name}`);
  }

  // Seed Sponsor Admin User
  let sponsorUser = await User.findOne({ email: sponsorEmail });
  if (!sponsorUser) {
    const passwordHash = await User.hashPassword(sponsorPassword);
    sponsorUser = await User.create({
      name: 'Sponsor Admin',
      email: sponsorEmail,
      passwordHash,
      role: 'sponsor',
      sponsorId: acmePharma._id,
      isActive: true,
      createdBy: admin._id
    });
    console.log(`✅ Created sponsor admin: ${sponsorUser.email}`);
  } else {
    console.log(`ℹ️  Sponsor admin exists: ${sponsorUser.email}`);
  }

  // Create 10 Sites
  const sitesData = [
    { name: 'ACME Irvington', address: { street: '200 Medical Ave', city: 'Irvington', state: 'NJ', zip: '07111' }, contactName: 'Dr. John Smith', contactEmail: 'john.smith@acmemedical.com', phone: '973-111-2222' },
    { name: 'Metro Medical Center', address: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' }, contactName: 'Dr. Sarah Wilson', contactEmail: 'sarah.wilson@metro.com', phone: '212-555-0101' },
    { name: 'Sunset Health Clinic', address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90210' }, contactName: 'Dr. Michael Chen', contactEmail: 'michael.chen@sunset.com', phone: '323-555-0202' },
    { name: 'Riverside Hospital', address: { street: '789 Pine St', city: 'Chicago', state: 'IL', zip: '60601' }, contactName: 'Dr. Emily Davis', contactEmail: 'emily.davis@riverside.com', phone: '312-555-0303' },
    { name: 'Valley Medical Group', address: { street: '321 Elm St', city: 'Houston', state: 'TX', zip: '77001' }, contactName: 'Dr. James Rodriguez', contactEmail: 'james.rodriguez@valley.com', phone: '713-555-0404' },
    { name: 'Coastal Health Center', address: { street: '654 Maple Dr', city: 'Miami', state: 'FL', zip: '33101' }, contactName: 'Dr. Lisa Thompson', contactEmail: 'lisa.thompson@coastal.com', phone: '305-555-0505' },
    { name: 'Mountain View Clinic', address: { street: '987 Cedar Ln', city: 'Denver', state: 'CO', zip: '80201' }, contactName: 'Dr. Robert Kim', contactEmail: 'robert.kim@mountain.com', phone: '303-555-0606' },
    { name: 'Desert Medical Center', address: { street: '147 Palm St', city: 'Phoenix', state: 'AZ', zip: '85001' }, contactName: 'Dr. Maria Garcia', contactEmail: 'maria.garcia@desert.com', phone: '602-555-0707' },
    { name: 'Bay Area Health', address: { street: '258 Harbor Blvd', city: 'San Francisco', state: 'CA', zip: '94101' }, contactName: 'Dr. David Lee', contactEmail: 'david.lee@bayarea.com', phone: '415-555-0808' },
    { name: 'Great Lakes Medical', address: { street: '369 Lake St', city: 'Detroit', state: 'MI', zip: '48201' }, contactName: 'Dr. Jennifer Brown', contactEmail: 'jennifer.brown@greatlakes.com', phone: '313-555-0909' }
  ];

  const createdSites = [];
  for (const siteData of sitesData) {
    let site = await Site.findOne({ name: siteData.name });
    if (!site) {
      site = await Site.create({
        ...siteData,
        sponsorId: acmePharma._id,
        status: 'Active',
        createdBy: admin._id
      });
      console.log(`✅ Created site: ${site.name}`);
    } else {
      console.log(`ℹ️  Site exists: ${site.name}`);
    }
    createdSites.push(site);
  }

  // Create Site Users
  const siteUserEmail = process.env.DEMO_SITE_EMAIL || 'site@acmemedical.com';
  const siteUserPassword = process.env.DEMO_SITE_PASSWORD || 'site123';
  let siteUser = await User.findOne({ email: siteUserEmail });
  if (!siteUser) {
    const passwordHash = await User.hashPassword(siteUserPassword);
    siteUser = await User.create({
      name: 'Site Coordinator',
      email: siteUserEmail,
      passwordHash,
      role: 'site',
      siteId: createdSites[0]._id,
      isActive: true,
      createdBy: admin._id
    });
    console.log(`✅ Created site user: ${siteUser.email}`);
  } else {
    console.log(`ℹ️  Site user exists: ${siteUser.email}`);
  }

  // Create 4 Studies
  const studiesData = [
    {
      title: 'IBS-C Treatment Study',
      protocolId: 'IBS-C-001',
      therapeuticArea: 'Gastroenterology',
      status: 'Recruitment',
      expectedSubjects: 30,
      startDate: new Date('2024-01-01')
    },
    {
      title: 'Cardiovascular Health Study',
      protocolId: 'CV-002',
      therapeuticArea: 'Cardiology',
      status: 'Recruitment',
      expectedSubjects: 25,
      startDate: new Date('2024-02-01')
    },
    {
      title: 'Diabetes Management Trial',
      protocolId: 'DM-003',
      therapeuticArea: 'Endocrinology',
      status: 'Recruitment',
      expectedSubjects: 35,
      startDate: new Date('2024-03-01')
    },
    {
      title: 'Oncology Treatment Study',
      protocolId: 'ONC-004',
      therapeuticArea: 'Oncology',
      status: 'Recruitment',
      expectedSubjects: 40,
      startDate: new Date('2024-04-01')
    }
  ];

  const createdStudies = [];
  for (const studyData of studiesData) {
    let study = await Study.findOne({ protocolId: studyData.protocolId });
    if (!study) {
      // Randomly assign 3-6 sites to each study
      const randomSites = createdSites.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3);
      
      study = await Study.create({
        ...studyData,
        sponsorId: acmePharma._id,
        linkedSites: randomSites.map(site => site._id),
        createdBy: admin._id
      });
      console.log(`✅ Created study: ${study.title} (${randomSites.length} sites)`);
    } else {
      console.log(`ℹ️  Study exists: ${study.title}`);
    }
    createdStudies.push(study);
  }

  // Create 20 Participants across all studies
  const participantNames = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '555-111-2222' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '555-333-4444' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@example.com', phone: '555-555-6666' },
    { firstName: 'Alice', lastName: 'Williams', email: 'alice.w@example.com', phone: '555-777-8888' },
    { firstName: 'Charlie', lastName: 'Brown', email: 'charlie.b@example.com', phone: '555-999-0000' },
    { firstName: 'Diana', lastName: 'Miller', email: 'diana.m@example.com', phone: '555-111-3333' },
    { firstName: 'Edward', lastName: 'Davis', email: 'edward.d@example.com', phone: '555-222-4444' },
    { firstName: 'Fiona', lastName: 'Garcia', email: 'fiona.g@example.com', phone: '555-333-5555' },
    { firstName: 'George', lastName: 'Martinez', email: 'george.m@example.com', phone: '555-444-6666' },
    { firstName: 'Helen', lastName: 'Anderson', email: 'helen.a@example.com', phone: '555-555-7777' },
    { firstName: 'Ivan', lastName: 'Taylor', email: 'ivan.t@example.com', phone: '555-666-8888' },
    { firstName: 'Julia', lastName: 'Thomas', email: 'julia.t@example.com', phone: '555-777-9999' },
    { firstName: 'Kevin', lastName: 'Hernandez', email: 'kevin.h@example.com', phone: '555-888-0000' },
    { firstName: 'Laura', lastName: 'Moore', email: 'laura.m@example.com', phone: '555-999-1111' },
    { firstName: 'Michael', lastName: 'Martin', email: 'michael.m@example.com', phone: '555-000-2222' },
    { firstName: 'Nancy', lastName: 'Jackson', email: 'nancy.j@example.com', phone: '555-111-3333' },
    { firstName: 'Oscar', lastName: 'Thompson', email: 'oscar.t@example.com', phone: '555-222-4444' },
    { firstName: 'Patricia', lastName: 'White', email: 'patricia.w@example.com', phone: '555-333-5555' },
    { firstName: 'Quincy', lastName: 'Harris', email: 'quincy.h@example.com', phone: '555-444-6666' },
    { firstName: 'Rachel', lastName: 'Sanchez', email: 'rachel.s@example.com', phone: '555-555-7777' }
  ];

  const statuses = ['Potential', 'Screening', 'Enrolled', 'Disqualified', 'Withdrawn'];
  const createdParticipants = [];

  for (let i = 0; i < 20; i++) {
    const participantData = participantNames[i];
    const randomStudy = createdStudies[Math.floor(Math.random() * createdStudies.length)];
    const randomSite = createdSites[Math.floor(Math.random() * createdSites.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    let participant = await Participant.findOne({ email: participantData.email, studyId: randomStudy._id });
    if (!participant) {
      participant = await Participant.create({
        ...participantData,
        studyId: randomStudy._id,
        siteId: randomSite._id,
        status: randomStatus,
        createdBy: siteUser._id
      });
      console.log(`✅ Created participant: ${participant.firstName} ${participant.lastName} (${participant.status})`);
      createdParticipants.push(participant);
    } else {
      console.log(`ℹ️  Participant exists: ${participant.firstName} ${participant.lastName}`);
    }
  }

  // Update study enrollment counts
  for (const study of createdStudies) {
    const enrolledCount = await Participant.countDocuments({ 
      studyId: study._id, 
      status: 'Enrolled' 
    });
    study.currentSubjects = enrolledCount;
    await study.save();
    console.log(`✅ Updated ${study.title} enrollment: ${enrolledCount}/${study.expectedSubjects}`);
  }

  // Create Milestones for studies
  const milestoneTemplates = [
    { code: 'SITE_INIT', title: 'Site Initiation', plannedDate: new Date('2024-02-15'), status: 'Complete' },
    { code: 'FIRST_ENROLL', title: 'First Enrollment', plannedDate: new Date('2024-03-01'), status: 'Complete' },
    { code: 'HALF_ENROLL', title: '50% Enrollment', plannedDate: new Date('2024-06-01'), status: 'NotStarted' },
    { code: 'STUDY_CLOSE', title: 'Study Closeout', plannedDate: new Date('2025-01-01'), status: 'NotStarted' }
  ];

  for (const study of createdStudies) {
    for (const milestoneData of milestoneTemplates) {
      let milestone = await Milestone.findOne({ code: milestoneData.code, studyId: study._id });
      if (!milestone) {
        milestone = await Milestone.create({
          ...milestoneData,
          studyId: study._id,
          createdBy: admin._id
        });
        console.log(`✅ Created milestone: ${milestone.title} for ${study.title}`);
      }
    }
  }

  console.log('\n🎉 Database seeding completed!\n');

  console.log('📋 Demo Credentials:');
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`Sponsor: ${sponsorEmail} / ${sponsorPassword}`);
  console.log(`Site: ${siteUserEmail} / ${siteUserPassword}`);

  console.log('\n📊 Created Data:');
  console.log(`- ${createdSites.length} Sites`);
  console.log(`- ${createdStudies.length} Studies`);
  console.log(`- ${createdParticipants.length} Participants`);
  console.log(`- ${milestoneTemplates.length * createdStudies.length} Milestones`);

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});