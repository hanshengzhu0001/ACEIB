"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
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
UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'studentProfile.subjects': 1 });
UserSchema.index({ 'mentorProfile.expertise': 1 });
UserSchema.index({ 'engagement.currentStreak': -1 });
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// Remove password from JSON output
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map