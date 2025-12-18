import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorStudentPairing extends Document {
  _id: mongoose.Types.ObjectId;
  mentor: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'terminated';

  // Matching data
  compatibilityScore: number; // 0-100 score from matching algorithm
  matchingCriteria: {
    subjectMatch: number;
    teachingStyleMatch: number;
    availabilityMatch: number;
    experienceLevelMatch: number;
    locationMatch?: number;
    weights: {
      subjectWeight: number;
      teachingStyleWeight: number;
      availabilityWeight: number;
      experienceLevelWeight: number;
      locationWeight?: number;
    };
  };

  // Relationship details
  startDate: Date;
  endDate?: Date;
  sessionCount: number;
  totalHours: number;

  // Ratings and feedback
  ratings: Array<{
    ratedBy: mongoose.Types.ObjectId; // User who gave the rating
    rating: number; // 1-5 scale
    feedback: string;
    ratedAt: Date;
    sessionNumber: number;
  }>;

  // Goals and progress
  goals: Array<{
    description: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
    targetDate?: Date;
    completedDate?: Date;
    progress: number; // 0-100
  }>;

  // Communication preferences
  communicationPrefs: {
    preferredPlatform: 'chat' | 'video' | 'phone' | 'in-person';
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
    duration: number; // minutes per session
    timezone: string;
  };

  // Administrative notes
  adminNotes: Array<{
    note: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

const MentorStudentPairingSchema = new Schema<IMentorStudentPairing>({
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mentor is required']
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'completed', 'terminated'],
    default: 'pending'
  },

  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  matchingCriteria: {
    subjectMatch: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    teachingStyleMatch: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    availabilityMatch: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    experienceLevelMatch: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    locationMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    weights: {
      subjectWeight: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.3
      },
      teachingStyleWeight: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.25
      },
      availabilityWeight: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.25
      },
      experienceLevelWeight: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.2
      },
      locationWeight: {
        type: Number,
        min: 0,
        max: 1
      }
    }
  },

  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  sessionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalHours: {
    type: Number,
    default: 0,
    min: 0
  },

  ratings: [{
    ratedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters']
    },
    ratedAt: {
      type: Date,
      default: Date.now
    },
    sessionNumber: {
      type: Number,
      required: true,
      min: 1
    }
  }],

  goals: [{
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Goal description cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'cancelled'],
      default: 'not-started'
    },
    targetDate: Date,
    completedDate: Date,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],

  communicationPrefs: {
    preferredPlatform: {
      type: String,
      enum: ['chat', 'video', 'phone', 'in-person'],
      default: 'chat'
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
      default: 'weekly'
    },
    duration: {
      type: Number,
      default: 60,
      min: 15,
      max: 240
    },
    timezone: {
      type: String,
      required: true
    }
  },

  adminNotes: [{
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
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
MentorStudentPairingSchema.index({ mentor: 1, status: 1 });
MentorStudentPairingSchema.index({ student: 1, status: 1 });
MentorStudentPairingSchema.index({ status: 1 });
MentorStudentPairingSchema.index({ compatibilityScore: -1 });
MentorStudentPairingSchema.index({ startDate: -1 });

// Compound index to ensure unique active pairings
MentorStudentPairingSchema.index(
  { mentor: 1, student: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' }
  }
);

// Virtual for average rating
MentorStudentPairingSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return null;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10; // Round to 1 decimal place
});

// Virtual for completion percentage
MentorStudentPairingSchema.virtual('completionPercentage').get(function() {
  if (this.goals.length === 0) return 0;
  const completedGoals = this.goals.filter(goal => goal.status === 'completed').length;
  return Math.round((completedGoals / this.goals.length) * 100);
});

// Static method to calculate compatibility score
MentorStudentPairingSchema.statics.calculateCompatibilityScore = function(criteria: {
  subjectMatch: number;
  teachingStyleMatch: number;
  availabilityMatch: number;
  experienceLevelMatch: number;
  locationMatch?: number;
  weights: {
    subjectWeight: number;
    teachingStyleWeight: number;
    availabilityWeight: number;
    experienceLevelWeight: number;
    locationWeight?: number;
  };
}): number {
  const { subjectMatch, teachingStyleMatch, availabilityMatch, experienceLevelMatch, locationMatch, weights } = criteria;

  let score = (
    subjectMatch * weights.subjectWeight +
    teachingStyleMatch * weights.teachingStyleWeight +
    availabilityMatch * weights.availabilityWeight +
    experienceLevelMatch * weights.experienceLevelWeight
  );

  if (locationMatch !== undefined && weights.locationWeight) {
    score += locationMatch * weights.locationWeight;
  }

  return Math.round(Math.max(0, Math.min(100, score)));
};

export default mongoose.model<IMentorStudentPairing>('MentorStudentPairing', MentorStudentPairingSchema);
