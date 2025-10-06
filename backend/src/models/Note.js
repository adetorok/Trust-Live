import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entityType: { 
      type: String, 
      enum: ['Study', 'Site', 'Participant'], 
      required: true 
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['note', 'task', 'consent', 'screening', 'visit'],
      default: 'note'
    },
    isCompleted: { type: Boolean, default: false },
    dueDate: Date
  },
  { timestamps: true }
);

// Index for efficient queries
NoteSchema.index({ entityType: 1, entityId: 1 });
NoteSchema.index({ authorId: 1 });

export const Note = mongoose.model('Note', NoteSchema);
