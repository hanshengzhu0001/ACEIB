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
const ChatSchema = new mongoose_1.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    participants: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
    messages: [{
            sender: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
                required: true,
                trim: true,
                maxlength: [2000, 'Message content cannot exceed 2000 characters']
            },
            messageType: {
                type: String,
                enum: ['text', 'image', 'file', 'system'],
                default: 'text'
            },
            timestamp: {
                type: Date,
                default: Date.now,
                index: true
            },
            readBy: [{
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'User'
                }],
            edited: {
                type: Boolean,
                default: false
            },
            editedAt: Date,
            attachments: [{
                    filename: {
                        type: String,
                        required: true
                    },
                    url: {
                        type: String,
                        required: true
                    },
                    fileType: {
                        type: String,
                        required: true
                    },
                    fileSize: {
                        type: Number,
                        required: true,
                        min: 0
                    }
                }]
        }],
    pairingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'MentorStudentPairing'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastMessage: {
        sender: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        timestamp: Date
    },
    settings: {
        allowFileSharing: {
            type: Boolean,
            default: true
        },
        maxFileSize: {
            type: Number,
            default: 5242880 // 5MB
        },
        messageRetentionDays: {
            type: Number,
            default: 365 // 1 year
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for better query performance
ChatSchema.index({ participants: 1 });
ChatSchema.index({ 'messages.timestamp': -1 });
ChatSchema.index({ pairingId: 1 });
ChatSchema.index({ isActive: 1 });
// Virtual for unread message count for a specific user
ChatSchema.virtual('unreadCount').get(function (userId) {
    return this.messages.filter(message => !message.readBy.includes(userId) &&
        message.sender.toString() !== userId).length;
});
// Pre-save middleware to update lastMessage
ChatSchema.pre('save', function (next) {
    if (this.messages && this.messages.length > 0) {
        const lastMsg = this.messages[this.messages.length - 1];
        this.lastMessage = {
            sender: lastMsg.sender,
            content: lastMsg.content,
            timestamp: lastMsg.timestamp
        };
    }
    next();
});
// Static method to find chat by participants
ChatSchema.statics.findByParticipants = function (participantIds) {
    return this.findOne({
        participants: { $all: participantIds, $size: participantIds.length },
        isActive: true
    });
};
// Method to mark messages as read
ChatSchema.methods.markAsRead = function (userId) {
    this.messages.forEach((message) => {
        if (!message.readBy.includes(userId) && !message.sender.equals(userId)) {
            message.readBy.push(userId);
        }
    });
    return this.save();
};
// Method to add a new message
ChatSchema.methods.addMessage = function (messageData) {
    const message = {
        _id: new mongoose_1.default.Types.ObjectId(),
        sender: messageData.sender,
        content: messageData.content,
        messageType: messageData.messageType || 'text',
        timestamp: new Date(),
        readBy: [messageData.sender], // Sender has read their own message
        attachments: messageData.attachments || []
    };
    this.messages.push(message);
    return this.save();
};
exports.default = mongoose_1.default.model('Chat', ChatSchema);
//# sourceMappingURL=Chat.js.map