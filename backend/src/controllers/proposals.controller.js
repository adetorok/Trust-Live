import { Proposal } from '../models/Proposal.js';
import { z } from 'zod';

// Validation schemas
const createProposalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().min(1, 'Company is required'),
  role: z.enum(['sponsor', 'site']),
  studyName: z.string().optional(),
  therapeuticDiscipline: z.string().optional(),
  numberOfStudies: z.number().min(1).default(1),
  numberOfSites: z.string().optional(),
  studyScope: z.enum(['US', 'Global']).default('US'),
  fpfvDate: z.string().optional(),
  studyDuration: z.string().optional(),
  studyDurationUnit: z.enum(['months', 'weeks', 'years']).default('months'),
  numberOfSubjects: z.string().optional(),
  activationDate: z.string().optional(),
  studyEndDate: z.string().optional(),
  message: z.string().optional()
});

export async function createProposal(req, res, next) {
  try {
    // Validate input
    const validatedData = createProposalSchema.parse(req.body);
    
    // Convert date strings to Date objects
    const proposalData = {
      ...validatedData,
      fpfvDate: validatedData.fpfvDate ? new Date(validatedData.fpfvDate) : undefined,
      activationDate: validatedData.activationDate ? new Date(validatedData.activationDate) : undefined,
      studyEndDate: validatedData.studyEndDate ? new Date(validatedData.studyEndDate) : undefined
    };

    const proposal = await Proposal.create(proposalData);
    
    res.status(201).json({ 
      success: true,
      message: 'Proposal submitted successfully',
      proposal: {
        id: proposal._id,
        status: proposal.status
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    next(error);
  }
}

export async function listProposals(req, res, next) {
  try {
    const { page = 1, limit = 20, status, role } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    
    const proposals = await Proposal.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Proposal.countDocuments(filter);
    
    res.json({
      proposals,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getProposal(req, res, next) {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes');
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    res.json({ proposal });
  } catch (error) {
    next(error);
  }
}

export async function updateProposal(req, res, next) {
  try {
    const { status, assignedTo, notes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    res.json({ proposal });
  } catch (error) {
    next(error);
  }
}

export async function deleteProposal(req, res, next) {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    next(error);
  }
}
