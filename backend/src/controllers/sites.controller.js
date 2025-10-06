import { Site } from '../models/Site.js';
import { Study } from '../models/Study.js';
import { Participant } from '../models/Participant.js';

export async function listSites(req, res, next) {
  try {
    let query = {};
    
    // Filter by sponsor for sponsor users
    if (req.user.role === 'sponsor' && req.user.sponsorId) {
      query.sponsorId = req.user.sponsorId;
    }
    
    // Filter by site for site users
    if (req.user.role === 'site' && req.user.siteId) {
      query._id = req.user.siteId;
    }

    const sites = await Site.find(query)
      .populate('sponsorId', 'name')
      .populate('users', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ sites });
  } catch (e) {
    next(e);
  }
}

export async function getSite(req, res, next) {
  try {
    const site = await Site.findById(req.params.id)
      .populate('sponsorId', 'name contactEmail')
      .populate('users', 'name email role')
      .populate('createdBy', 'name email');

    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json({ site });
  } catch (e) {
    next(e);
  }
}

export async function createSite(req, res, next) {
  try {
    const siteData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Set sponsorId for sponsor users
    if (req.user.role === 'sponsor' && req.user.sponsorId) {
      siteData.sponsorId = req.user.sponsorId;
    }

    const site = await Site.create(siteData);
    
    // Populate the response
    await site.populate('sponsorId', 'name');

    res.status(201).json({ site });
  } catch (e) {
    next(e);
  }
}

export async function updateSite(req, res, next) {
  try {
    const site = await Site.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true }
    )
      .populate('sponsorId', 'name')
      .populate('users', 'name email role');

    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json({ site });
  } catch (e) {
    next(e);
  }
}

export async function deleteSite(req, res, next) {
  try {
    const site = await Site.findByIdAndDelete(req.params.id);
    
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Also delete associated participants
    await Participant.deleteMany({ siteId: req.params.id });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

export async function getSiteParticipants(req, res, next) {
  try {
    const participants = await Participant.find({ siteId: req.params.id })
      .populate('studyId', 'title protocolId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ participants });
  } catch (e) {
    next(e);
  }
}

export async function getSiteStudies(req, res, next) {
  try {
    const studies = await Study.find({ linkedSites: req.params.id })
      .populate('sponsorId', 'name')
      .sort({ createdAt: -1 });

    res.json({ studies });
  } catch (e) {
    next(e);
  }
}
