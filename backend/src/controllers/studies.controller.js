import { Study } from '../models/Study.js';
import { Site } from '../models/Site.js';
import { Participant } from '../models/Participant.js';

export async function listStudies(req, res, next) {
  try {
    let query = {};
    
    // Filter by sponsor for sponsor users
    if (req.user.role === 'sponsor' && req.user.sponsorId) {
      query.sponsorId = req.user.sponsorId;
    }
    
    // Filter by linked sites for site users
    if (req.user.role === 'site' && req.user.siteId) {
      query.linkedSites = req.user.siteId;
    }

    const studies = await Study.find(query)
      .populate('sponsorId', 'name')
      .populate('linkedSites', 'name status')
      .sort({ createdAt: -1 });

    res.json({ studies });
  } catch (e) {
    next(e);
  }
}

export async function getStudy(req, res, next) {
  try {
    const study = await Study.findById(req.params.id)
      .populate('sponsorId', 'name contactEmail')
      .populate('linkedSites', 'name status contactName contactEmail')
      .populate('createdBy', 'name email');

    if (!study) {
      return res.status(404).json({ error: 'Study not found' });
    }

    res.json({ study });
  } catch (e) {
    next(e);
  }
}

export async function createStudy(req, res, next) {
  try {
    const studyData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Set sponsorId for sponsor users
    if (req.user.role === 'sponsor' && req.user.sponsorId) {
      studyData.sponsorId = req.user.sponsorId;
    }

    const study = await Study.create(studyData);
    
    // Populate the response
    await study.populate('sponsorId', 'name');
    await study.populate('linkedSites', 'name status');

    res.status(201).json({ study });
  } catch (e) {
    next(e);
  }
}

export async function updateStudy(req, res, next) {
  try {
    const study = await Study.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true }
    )
      .populate('sponsorId', 'name')
      .populate('linkedSites', 'name status');

    if (!study) {
      return res.status(404).json({ error: 'Study not found' });
    }

    res.json({ study });
  } catch (e) {
    next(e);
  }
}

export async function deleteStudy(req, res, next) {
  try {
    const study = await Study.findByIdAndDelete(req.params.id);
    
    if (!study) {
      return res.status(404).json({ error: 'Study not found' });
    }

    // Also delete associated participants
    await Participant.deleteMany({ studyId: req.params.id });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

export async function getStudyParticipants(req, res, next) {
  try {
    const participants = await Participant.find({ studyId: req.params.id })
      .populate('siteId', 'name contactName')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ participants });
  } catch (e) {
    next(e);
  }
}

export async function addSiteToStudy(req, res, next) {
  try {
    const { siteId } = req.params;
    const study = await Study.findById(req.params.id);
    
    if (!study) {
      return res.status(404).json({ error: 'Study not found' });
    }

    // Check if site exists
    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Add site to study if not already linked
    if (!study.linkedSites.includes(siteId)) {
      study.linkedSites.push(siteId);
      await study.save();
    }

    await study.populate('linkedSites', 'name status');
    res.json({ study });
  } catch (e) {
    next(e);
  }
}

export async function removeSiteFromStudy(req, res, next) {
  try {
    const { siteId } = req.params;
    const study = await Study.findById(req.params.id);
    
    if (!study) {
      return res.status(404).json({ error: 'Study not found' });
    }

    // Remove site from study
    study.linkedSites = study.linkedSites.filter(id => id.toString() !== siteId);
    await study.save();

    await study.populate('linkedSites', 'name status');
    res.json({ study });
  } catch (e) {
    next(e);
  }
}
