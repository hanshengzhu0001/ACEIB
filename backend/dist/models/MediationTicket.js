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
const MediationTicketSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reporter is required']
    },
    reported: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reported user is required']
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Related entities
    relatedPairing: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'MentorStudentPairing'
    },
    relatedChat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    // Resolution details
    resolution: {
        resolvedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
MediationTicketSchema.pre('save', async function (next) {
    if (this.isNew && !this.ticketNumber) {
        // Generate ticket number like MED-20241218-001
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const count = await mongoose_1.default.model('MediationTicket').countDocuments({
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
MediationTicketSchema.virtual('daysOpen').get(function () {
    const now = new Date();
    const created = this.createdAt;
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
exports.default = mongoose_1.default.model('MediationTicket', MediationTicketSchema);
//# sourceMappingURL=MediationTicket.js.map