import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  roomId: string; // Unique identifier for the chat room (e.g., "mentor-student-{pairingId}")
  participants: mongoose.Types.ObjectId[]; // Array of user IDs in the chat

  // Message history
  messages: Array<{
    _id: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    messageType: 'text' | 'image' | 'file' | 'system';
    timestamp: Date;
    readBy: mongoose.Types.ObjectId[]; // Users who have read this message
    edited?: boolean;
    editedAt?: Date;
    attachments?: Array<{
      filename: string;
      url: string;
      fileType: string;
      fileSize: number;
    }>;
  }>;

  // Chat metadata
  pairingId?: mongoose.Types.ObjectId; // Reference to mentor-student pairing
  isActive: boolean;
  lastMessage?: {
    sender: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
  };

  // Settings
  settings: {
    allowFileSharing: boolean;
    maxFileSize: number; // in bytes
    messageRetentionDays: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],

  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: 'MentorStudentPairing'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessage: {
    sender: {
      type: Schema.Types.ObjectId,
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
ChatSchema.virtual('unreadCount').get(function(userId: string) {
  return this.messages.filter(message =>
    !message.readBy.includes(userId as any) &&
    message.sender.toString() !== userId
  ).length;
});

// Pre-save middleware to update lastMessage
ChatSchema.pre('save', function(next) {
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
ChatSchema.statics.findByParticipants = function(participantIds: mongoose.Types.ObjectId[]) {
  return this.findOne({
    participants: { $all: participantIds, $size: participantIds.length },
    isActive: true
  });
};

// Method to mark messages as read
ChatSchema.methods.markAsRead = function(userId: mongoose.Types.ObjectId): Promise<any> {
  this.messages.forEach((message: any) => {
    if (!message.readBy.includes(userId) && !message.sender.equals(userId)) {
      message.readBy.push(userId);
    }
  });
  return this.save();
};

// Method to add a new message
ChatSchema.methods.addMessage = function(messageData: {
  sender: mongoose.Types.ObjectId;
  content: string;
  messageType?: string;
  attachments?: any[];
}): Promise<any> {
  const message = {
    _id: new mongoose.Types.ObjectId(),
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

export default mongoose.model<IChat>('Chat', ChatSchema);
