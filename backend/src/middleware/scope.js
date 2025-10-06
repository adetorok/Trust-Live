import { User } from '../models/User.js';
import { Sponsor } from '../models/Sponsor.js';
import { Site } from '../models/Site.js';
import { Study } from '../models/Study.js';
import { Participant } from '../models/Participant.js';

export function scopeGuard(entityType) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Admin can access everything
      if (user.role === 'admin') {
        return next();
      }

      let hasAccess = false;

      switch (entityType) {
        case 'User':
          // Users can read their own profile, admin can read all
          hasAccess = user.role === 'admin' || user.id === id;
          break;

        case 'Sponsor':
          if (user.role === 'sponsor') {
            const sponsor = await Sponsor.findById(id);
            hasAccess = sponsor && sponsor._id.toString() === user.sponsorId?.toString();
          }
          break;

        case 'Site':
          if (user.role === 'sponsor') {
            const site = await Site.findById(id);
            hasAccess = site && site.sponsorId.toString() === user.sponsorId?.toString();
          } else if (user.role === 'site') {
            hasAccess = user.siteId?.toString() === id;
          }
          break;

        case 'Study':
          if (user.role === 'sponsor') {
            const study = await Study.findById(id);
            hasAccess = study && study.sponsorId.toString() === user.sponsorId?.toString();
          } else if (user.role === 'site') {
            const study = await Study.findById(id);
            hasAccess = study && study.linkedSites.includes(user.siteId);
          }
          break;

        case 'Participant':
          if (user.role === 'sponsor') {
            const participant = await Participant.findById(id).populate('studyId');
            hasAccess = participant && participant.studyId.sponsorId.toString() === user.sponsorId?.toString();
          } else if (user.role === 'site') {
            const participant = await Participant.findById(id);
            hasAccess = participant && participant.siteId.toString() === user.siteId?.toString();
          }
          break;

        default:
          hasAccess = false;
      }

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    } catch (error) {
      console.error('Scope guard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
