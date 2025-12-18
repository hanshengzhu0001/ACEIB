import mongoose, { Document, Schema } from 'mongoose';

export interface IMediationTicket extends Document {
  _id: mongoose.Types.ObjectId;
  ticketNumber: string;
  issueType: 'academic' | 'communication' | 'schedule' | 'behavior' | 'technical' | 'other';
  title: string;
  description: string;
  status: 'open' | 'in-review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Parties involved
  reporter: mongoose.Types.ObjectId; // User who reported the issue
  reported: mongoose.Types.ObjectId; // User being reported
  assignedTo?: mongoose.Types.ObjectId; // Admin/mediator assigned to handle

  // Related entities
  relatedPairing?: mongoose.Types.ObjectId; // Reference to mentor-student pairing
  relatedChat?: mongoose.Types.ObjectId; // Reference to related chat if applicable

  // Resolution details
  resolution?: {
    resolvedBy: mongoose.Types.ObjectId;
    resolution: string;
    resolvedAt: Date;
    satisfactionRating?: number; // 1-5 scale
    feedback?: string;
  };

  // Metadata
  tags: string[];
  attachments: string[]; // URLs to uploaded files
  internalNotes: Array<{
    note: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;

  // Audit trail
  statusHistory: Array<{
    status: string;
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
    note?: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

const MediationTicketSchema = new Schema<IMediationTicket>({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  issueType: {
    type: String,
    enum: ['academic', 'communication', 'schedule', 'behavior', 'technical', 'other'],
    required: [true, 'Issue type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in-review', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Parties involved
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  reported: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reported user is required']
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  // Related entities
  relatedPairing: {
    type: Schema.Types.ObjectId,
    ref: 'MentorStudentPairing'
  },
  relatedChat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat'
  },

  // Resolution details
  resolution: {
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolution: {
      type: String,
      trim: true,
      maxlength: [2000, 'Resolution cannot exceed 2000 characters']
    },
    resolvedAt: Date,
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback cannot exceed 500 characters']
    }
  },

  // Metadata
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  attachments: [{
    type: String,
    trim: true
  }],
  internalNotes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Audit trail
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
MediationTicketSchema.index({ status: 1, priority: -1 });
MediationTicketSchema.index({ reporter: 1 });
MediationTicketSchema.index({ reported: 1 });
MediationTicketSchema.index({ assignedTo: 1 });
MediationTicketSchema.index({ issueType: 1 });
MediationTicketSchema.index({ createdAt: -1 });

// Pre-save middleware to generate ticket number
MediationTicketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    // Generate ticket number like MED-20241218-001
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('MediationTicket').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    });
    this.ticketNumber = `MED-${dateStr}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Virtual for days open
MediationTicketSchema.virtual('daysOpen').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

export default mongoose.model<IMediationTicket>('MediationTicket', MediationTicketSchema);
