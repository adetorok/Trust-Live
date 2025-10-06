import { Participant } from '../models/Participant.js';
import { Study } from '../models/Study.js';
import { Note } from '../models/Note.js';
import { EventLog } from '../models/EventLog.js';

// State machine for participant transitions
const ALLOWED_TRANSITIONS = {
  'Potential': ['PendingConsent'],
  'PendingConsent': ['Screening'],
  'Screening': ['Enrolled', 'ScreenFail'],
  'Enrolled': ['Completed', 'Withdrawn'],
  'Completed': [], // Terminal state
  'ScreenFail': [], // Terminal state
  'Withdrawn': [] // Terminal state
};

export async function listParticipants(req, res, next) {
  try {
    const { page = 1, limit = 10, studyId, siteId, status } = req.query;
    const query = {};

    // Apply role-based filtering
    if (req.user.role === 'sponsor') {
      // Sponsor can only see participants from their studies
      const studies = await Study.find({ sponsorId: req.user.sponsorId }).select('_id');
      query.studyId = { $in: studies.map(s => s._id) };
    } else if (req.user.role === 'site') {
      // Site can only see participants from their site
      query.siteId = req.user.siteId;
    }

    if (studyId) query.studyId = studyId;
    if (siteId) query.siteId = siteId;
    if (status) query.status = status;

    const participants = await Participant.find(query)
      .populate('studyId', 'title protocolId')
      .populate('siteId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Participant.countDocuments(query);

    res.json({
      participants,
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

export async function getParticipant(req, res, next) {
  try {
    const participant = await Participant.findById(req.params.id)
      .populate('studyId', 'title protocolId status')
      .populate('siteId', 'name contactName contactEmail')
      .populate('activityNotes', 'content authorId createdAt type');

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json({ participant });
  } catch (error) {
    next(error);
  }
}

export async function createParticipant(req, res, next) {
  try {
    const { firstName, lastName, email, phone, studyId, siteId, attributes } = req.body;

    // Verify study and site access
    const study = await Study.findById(studyId);
    if (!study) {
      return res.status(404).json({ error: 'Study not found' });
    }

    // Check access permissions
    if (req.user.role === 'sponsor' && study.sponsorId.toString() !== req.user.sponsorId?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (req.user.role === 'site' && siteId !== req.user.siteId?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const participant = await Participant.create({
      firstName,
      lastName,
      email,
      phone,
      studyId,
      siteId,
      attributes: attributes || {}
    });

    // Log the creation
    await EventLog.create({
      actorId: req.user.id,
      action: 'CREATE',
      entityType: 'Participant',
      entityId: participant._id,
      to: { status: participant.status },
      meta: { firstName, lastName, email }
    });

    res.status(201).json({ participant });
  } catch (error) {
    next(error);
  }
}

export async function updateParticipant(req, res, next) {
  try {
    const { firstName, lastName, email, phone, attributes } = req.body;
    
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, attributes },
      { new: true, runValidators: true }
    );

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Log the update
    await EventLog.create({
      actorId: req.user.id,
      action: 'UPDATE',
      entityType: 'Participant',
      entityId: participant._id,
      to: { firstName, lastName, email, phone, attributes }
    });

    res.json({ participant });
  } catch (error) {
    next(error);
  }
}

export async function transitionParticipant(req, res, next) {
  try {
    const { to } = req.body;
    const participant = await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Validate transition
    const currentStatus = participant.status;
    if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(to)) {
      return res.status(400).json({ 
        error: 'Invalid transition', 
        currentStatus, 
        requestedStatus: to,
        allowedTransitions: ALLOWED_TRANSITIONS[currentStatus]
      });
    }

    const previousStatus = participant.status;
    participant.status = to;

    // Apply automation based on new status
    await applyStatusAutomation(participant, to, req.user.id);

    await participant.save();

    // Log the state change
    await EventLog.create({
      actorId: req.user.id,
      action: 'STATE_CHANGE',
      entityType: 'Participant',
      entityId: participant._id,
      from: { status: previousStatus },
      to: { status: to }
    });

    res.json({ participant });
  } catch (error) {
    next(error);
  }
}

export async function addParticipantNote(req, res, next) {
  try {
    const { content, type = 'note' } = req.body;
    
    const note = await Note.create({
      authorId: req.user.id,
      entityType: 'Participant',
      entityId: req.params.id,
      content,
      type
    });

    // Add note to participant
    await Participant.findByIdAndUpdate(req.params.id, {
      $push: { activityNotes: note._id }
    });

    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
}

// Automation function for status changes
async function applyStatusAutomation(participant, newStatus, actorId) {
  switch (newStatus) {
    case 'PendingConsent':
      // Create consent checklist
      await Note.create({
        authorId: actorId,
        entityType: 'Participant',
        entityId: participant._id,
        content: 'Consent form sent to participant',
        type: 'consent'
      });
      break;

    case 'Screening':
      // Create screening tasks
      await Note.create({
        authorId: actorId,
        entityType: 'Participant',
        entityId: participant._id,
        content: 'Screening visit scheduled',
        type: 'screening'
      });
      break;

    case 'Enrolled':
      // Increment study enrollment count
      await Study.findByIdAndUpdate(participant.studyId, {
        $inc: { enrolledSubjects: 1 }
      });
      
      // Create enrollment note
      await Note.create({
        authorId: actorId,
        entityType: 'Participant',
        entityId: participant._id,
        content: 'Participant enrolled in study',
        type: 'note'
      });
      break;

    case 'Completed':
    case 'ScreenFail':
    case 'Withdrawn':
      // Close any open tasks
      await Note.updateMany(
        { 
          entityType: 'Participant', 
          entityId: participant._id, 
          isCompleted: false 
        },
        { isCompleted: true }
      );
      break;
  }
}
