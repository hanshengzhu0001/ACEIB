import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'mentor' | 'admin';
  profile: {
    avatar?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    languages: string[];
  };
  // Student-specific fields
  studentProfile?: {
    gradeLevel: string;
    subjects: string[];
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    availability: string[]; // e.g., ['monday-9am', 'wednesday-2pm']
    goals: string[];
    preferredMentorExperience: 'beginner' | 'intermediate' | 'advanced';
  };
  // Mentor-specific fields
  mentorProfile?: {
    expertise: string[];
    teachingStyle: 'structured' | 'flexible' | 'interactive' | 'project-based';
    experienceYears: number;
    availability: string[];
    maxStudents: number;
    certifications: string[];
    hourlyRate?: number;
  };
  // Engagement tracking
  engagement: {
    currentStreak: number;
    longestStreak: number;
    lastActivity: Date;
    totalSessions: number;
    averageRating?: number;
  };
  // System fields
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    required: [true, 'Role is required']
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: String,
    timezone: String,
    languages: [{
      type: String,
      trim: true
    }]
  },
  studentProfile: {
    gradeLevel: {
      type: String,
      enum: ['elementary', 'middle-school', 'high-school', 'college', 'adult-learner']
    },
    subjects: [{
      type: String,
      trim: true
    }],
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading']
    },
    availability: [{
      type: String,
      trim: true
    }],
    goals: [{
      type: String,
      trim: true
    }],
    preferredMentorExperience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  },
  mentorProfile: {
    expertise: [{
      type: String,
      trim: true
    }],
    teachingStyle: {
      type: String,
      enum: ['structured', 'flexible', 'interactive', 'project-based']
    },
    experienceYears: {
      type: Number,
      min: 0
    },
    availability: [{
      type: String,
      trim: true
    }],
    maxStudents: {
      type: Number,
      min: 1,
      default: 5
    },
    certifications: [{
      type: String,
      trim: true
    }],
    hourlyRate: {
      type: Number,
      min: 0
    }
  },
  engagement: {
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'studentProfile.subjects': 1 });
UserSchema.index({ 'mentorProfile.expertise': 1 });
UserSchema.index({ 'engagement.currentStreak': -1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<IUser>('User', UserSchema);
