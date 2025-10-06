import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Sponsor } from '../models/Sponsor.js';
import { Site } from '../models/Site.js';
import { Study } from '../models/Study.js';
import { Participant } from '../models/Participant.js';
import { Milestone } from '../models/Milestone.js';

async function run() {
  await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trust');
  
  console.log('🌱 Seeding database...');

  // Create Admin
  const adminEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@trust.com';
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || 'admin123';
  
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await User.hashPassword(adminPassword);
    admin = await User.create({ 
      email: adminEmail, 
      name: 'System Admin', 
      passwordHash, 
      role: 'admin',
      isActive: true
    });
    console.log('✅ Created admin:', admin.email);
  } else {
    console.log('ℹ️  Admin exists:', admin.email);
  }

  // Create Sponsor
  let sponsor = await Sponsor.findOne({ name: 'ACME Pharmaceuticals' });
  if (!sponsor) {
    sponsor = await Sponsor.create({
      name: 'ACME Pharmaceuticals',
      companyEmail: 'contact@acmepharma.com',
      phone: '+1-555-0123',
      address: {
        street: '123 Research Drive',
        city: 'Boston',
        state: 'MA',
        zip: '02101',
        country: 'US'
      },
      createdBy: admin._id
    });
    console.log('✅ Created sponsor:', sponsor.name);
  } else {
    console.log('ℹ️  Sponsor exists:', sponsor.name);
  }

  // Create Sponsor Admin
  const sponsorAdminEmail = 'sponsor@acmepharma.com';
  let sponsorAdmin = await User.findOne({ email: sponsorAdminEmail });
  if (!sponsorAdmin) {
    const passwordHash = await User.hashPassword('sponsor123');
    sponsorAdmin = await User.create({
      email: sponsorAdminEmail,
      name: 'Sponsor Admin',
      passwordHash,
      role: 'sponsor',
      sponsorId: sponsor._id,
      isActive: true,
      createdBy: admin._id
    });
    console.log('✅ Created sponsor admin:', sponsorAdmin.email);
  } else {
    console.log('ℹ️  Sponsor admin exists:', sponsorAdmin.email);
  }

  // Create Site
  let site = await Site.findOne({ name: 'ACME Irvington' });
  if (!site) {
    site = await Site.create({
      name: 'ACME Irvington',
      address: {
        street: '456 Medical Plaza',
        city: 'Irvington',
        state: 'NJ',
        zip: '07111',
        country: 'US'
      },
      contactName: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.johnson@acmemedical.com',
      phone: '+1-555-0456',
      sponsorId: sponsor._id,
      status: 'Active',
      createdBy: admin._id
    });
    console.log('✅ Created site:', site.name);
  } else {
    console.log('ℹ️  Site exists:', site.name);
  }

  // Create Site User
  const siteUserEmail = 'site@acmemedical.com';
  let siteUser = await User.findOne({ email: siteUserEmail });
  if (!siteUser) {
    const passwordHash = await User.hashPassword('site123');
    siteUser = await User.create({
      email: siteUserEmail,
      name: 'Site Coordinator',
      passwordHash,
      role: 'site',
      siteId: site._id,
      isActive: true,
      createdBy: admin._id
    });
    console.log('✅ Created site user:', siteUser.email);
  } else {
    console.log('ℹ️  Site user exists:', siteUser.email);
  }

  // Create Study
  let study = await Study.findOne({ protocolId: 'IBS-C-001' });
  if (!study) {
    study = await Study.create({
      title: 'IBS-C Treatment Study',
      protocolId: 'IBS-C-001',
      therapeuticArea: 'Gastroenterology',
      sponsorId: sponsor._id,
      status: 'Recruitment',
      expectedSubjects: 30,
      enrolledSubjects: 0,
      linkedSites: [site._id],
      createdBy: admin._id
    });
    console.log('✅ Created study:', study.title);
  } else {
    console.log('ℹ️  Study exists:', study.title);
  }

  // Create Milestones
  const milestones = [
    { code: 'SITE_INIT', title: 'Site Initiation', plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { code: 'FIRST_ENROLL', title: 'First Enrollment', plannedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    { code: '50_PERCENT', title: '50% Enrollment', plannedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { code: 'STUDY_CLOSE', title: 'Study Closeout', plannedDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
  ];

  for (const milestoneData of milestones) {
    let milestone = await Milestone.findOne({ studyId: study._id, code: milestoneData.code });
    if (!milestone) {
      milestone = await Milestone.create({
        ...milestoneData,
        studyId: study._id,
        createdBy: admin._id
      });
      console.log('✅ Created milestone:', milestone.title);
    }
  }

  // Create Participants
  const participants = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phone: '+1-555-0001' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@email.com', phone: '+1-555-0002' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@email.com', phone: '+1-555-0003' }
  ];

  for (const participantData of participants) {
    let participant = await Participant.findOne({ 
      studyId: study._id, 
      email: participantData.email 
    });
    if (!participant) {
      participant = await Participant.create({
        ...participantData,
        studyId: study._id,
        siteId: site._id,
        status: 'Potential'
      });
      console.log('✅ Created participant:', participant.firstName, participant.lastName);
    }
  }

  // Update sponsor with users and studies
  await Sponsor.findByIdAndUpdate(sponsor._id, {
    $addToSet: { 
      admins: sponsorAdmin._id,
      studies: study._id
    }
  });

  await Site.findByIdAndUpdate(site._id, {
    $addToSet: { users: siteUser._id }
  });

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Demo Credentials:');
  console.log('Admin: admin@trust.com / admin123');
  console.log('Sponsor: sponsor@acmepharma.com / sponsor123');
  console.log('Site: site@acmemedical.com / site123');
  
  process.exit(0);
}

run().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});