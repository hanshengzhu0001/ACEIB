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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MentorStudentPairingSchema = new mongoose_1.Schema({
    mentor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Mentor is required']
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
MentorStudentPairingSchema.index({ mentor: 1, student: 1, status: 1 }, {
    unique: true,
    partialFilterExpression: { status: 'active' }
});
// Virtual for average rating
MentorStudentPairingSchema.virtual('averageRating').get(function () {
    if (this.ratings.length === 0)
        return null;
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10; // Round to 1 decimal place
});
// Virtual for completion percentage
MentorStudentPairingSchema.virtual('completionPercentage').get(function () {
    if (this.goals.length === 0)
        return 0;
    const completedGoals = this.goals.filter(goal => goal.status === 'completed').length;
    return Math.round((completedGoals / this.goals.length) * 100);
});
// Static method to calculate compatibility score
MentorStudentPairingSchema.statics.calculateCompatibilityScore = function (criteria) {
    const { subjectMatch, teachingStyleMatch, availabilityMatch, experienceLevelMatch, locationMatch, weights } = criteria;
    let score = (subjectMatch * weights.subjectWeight +
        teachingStyleMatch * weights.teachingStyleWeight +
        availabilityMatch * weights.availabilityWeight +
        experienceLevelMatch * weights.experienceLevelWeight);
    if (locationMatch !== undefined && weights.locationWeight) {
        score += locationMatch * weights.locationWeight;
    }
    return Math.round(Math.max(0, Math.min(100, score)));
};
exports.default = mongoose_1.default.model('MentorStudentPairing', MentorStudentPairingSchema);
//# sourceMappingURL=MentorStudentPairing.js.map