import { Sponsor } from '../models/Sponsor.js';
import { User } from '../models/User.js';

export async function listSponsors(req, res, next) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const sponsors = await Sponsor.find(query)
      .populate('admins', 'name email')
      .populate('studies', 'title protocolId status')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Sponsor.countDocuments(query);

    res.json({
      sponsors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getSponsor(req, res, next) {
  try {
    const sponsor = await Sponsor.findById(req.params.id)
      .populate('admins', 'name email role')
      .populate('studies', 'title protocolId status expectedSubjects enrolledSubjects');
    
    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json({ sponsor });
  } catch (error) {
    next(error);
  }
}

export async function createSponsor(req, res, next) {
  try {
    const { name, companyEmail, phone, address } = req.body;
    
    const sponsor = await Sponsor.create({
      name,
      companyEmail,
      phone,
      address,
      createdBy: req.user.id
    });

    res.status(201).json({ sponsor });
  } catch (error) {
    next(error);
  }
}

export async function updateSponsor(req, res, next) {
  try {
    const { name, companyEmail, phone, address } = req.body;
    
    const sponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      { name, companyEmail, phone, address, updatedBy: req.user.id },
      { new: true, runValidators: true }
    );

    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json({ sponsor });
  } catch (error) {
    next(error);
  }
}

export async function deleteSponsor(req, res, next) {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    
    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getSponsorStudies(req, res, next) {
  try {
    const { Study } = await import('../models/Study.js');
    
    const studies = await Study.find({ sponsorId: req.params.id })
      .populate('linkedSites', 'name status')
      .sort({ createdAt: -1 });

    res.json({ studies });
  } catch (error) {
    next(error);
  }
}
