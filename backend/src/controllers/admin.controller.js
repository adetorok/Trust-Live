import { User } from '../models/User.js';
import { Sponsor } from '../models/Sponsor.js';
import { Site } from '../models/Site.js';
import { Study } from '../models/Study.js';
import { Participant } from '../models/Participant.js';

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find().select('-passwordHash').populate('sponsorId', 'name').populate('siteId', 'name');
    res.json({ users });
  } catch (e) {
    next(e);
  }
}

export async function listSites(req, res, next) {
  try {
    const sites = await Site.find().populate('sponsorId', 'name').populate('users', 'name email');
    res.json({ sites });
  } catch (e) {
    next(e);
  }
}

export async function listStudies(req, res, next) {
  try {
    const studies = await Study.find().populate('sponsorId', 'name').populate('linkedSites', 'name status');
    res.json({ studies });
  } catch (e) {
    next(e);
  }
}

export async function listLeads(req, res, next) {
  try {
    // "Leads" are participants in "Potential" status
    const leads = await Participant.find({ status: 'Potential' })
      .populate('studyId', 'title protocolId')
      .populate('siteId', 'name contactName');
    res.json({ leads });
  } catch (e) {
    next(e);
  }
}

export async function getDashboardStats(req, res, next) {
  try {
    const [totalUsers, totalSites, totalStudies, totalParticipants, activeStudies] = await Promise.all([
      User.countDocuments(),
      Site.countDocuments(),
      Study.countDocuments(),
      Participant.countDocuments(),
      Study.countDocuments({ status: 'Recruitment' })
    ]);

    const participantsByStatus = await Participant.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalSites,
        totalStudies,
        totalParticipants,
        activeStudies
      },
      participantsByStatus
    });
  } catch (e) {
    next(e);
  }
}

// User management
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role, sponsorId, siteId } = req.body;
    
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      sponsorId: sponsorId || null,
      siteId: siteId || null,
      createdBy: req.user.id
    });

    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
}

// Site management
export async function createSite(req, res, next) {
  try {
    const { name, address, contactName, contactEmail, phone, sponsorId } = req.body;
    
    const site = await Site.create({
      name,
      address,
      contactName,
      contactEmail,
      phone,
      sponsorId,
      createdBy: req.user.id
    });

    res.status(201).json({ site });
  } catch (e) {
    next(e);
  }
}

// Study management
export async function createStudy(req, res, next) {
  try {
    const { title, protocolId, therapeuticArea, sponsorId, expectedSubjects, linkedSites } = req.body;
    
    const study = await Study.create({
      title,
      protocolId,
      therapeuticArea,
      sponsorId,
      expectedSubjects,
      linkedSites: linkedSites || [],
      createdBy: req.user.id
    });

    res.status(201).json({ study });
  } catch (e) {
    next(e);
  }
}


