import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';
import MentorStudentPairing from '../models/MentorStudentPairing';
import { logger } from '../utils/logger';

const router = express.Router();

// @route   POST /api/chat/rooms
// @desc    Create or get chat room for mentor-student pair
// @access  Private
router.post('/rooms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pairingId } = req.body;
    const userId = (req as any).user.userId;

    if (!pairingId) {
      return res.status(400).json({
        success: false,
        error: 'Pairing ID is required'
      });
    }

    // Verify pairing exists and user is part of it
    const pairing = await MentorStudentPairing.findById(pairingId);
    if (!pairing) {
      return res.status(404).json({
        success: false,
        error: 'Pairing not found'
      });
    }

    if (pairing.mentor.toString() !== userId && pairing.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this chat'
      });
    }

    if (pairing.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Pairing is not active'
      });
    }

    const roomId = `pairing-${pairingId}`;

    // Check if chat room already exists
    let chat = await Chat.findOne({ roomId, isActive: true });

    if (!chat) {
      // Create new chat room
      chat = new Chat({
        roomId,
        participants: [pairing.mentor, pairing.student],
        pairingId
      });
      await chat.save();

      logger.info(`Chat room created: ${roomId}`);
    }

    res.json({
      success: true,
      data: {
        chat: {
          id: chat._id,
          roomId: chat.roomId,
          participants: chat.participants,
          lastMessage: chat.lastMessage,
          createdAt: chat.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/chat/rooms
// @desc    Get user's chat rooms
// @access  Private
router.get('/rooms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const chats = await Chat.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'firstName lastName email profile.avatar')
    .populate('lastMessage.sender', 'firstName lastName')
    .sort({ updatedAt: -1 });

    // Add unread count for each chat
    const chatsWithUnread = chats.map(chat => {
      const unreadCount = chat.messages.filter(msg =>
        !msg.readBy.includes(userId as any) &&
        msg.sender.toString() !== userId
      ).length;

      return {
        id: chat._id,
        roomId: chat.roomId,
        participants: chat.participants,
        lastMessage: chat.lastMessage,
        unreadCount,
        updatedAt: chat.updatedAt
      };
    });

    res.json({
      success: true,
      data: { chats: chatsWithUnread }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/chat/rooms/:roomId/messages
// @desc    Get messages for a chat room
// @access  Private
router.get('/rooms/:roomId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const userId = (req as any).user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const chat = await Chat.findOne({ roomId, isActive: true });
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    // Verify user is participant
    if (!chat.participants.includes(userId as any)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this chat'
      });
    }

    // Get paginated messages
    const messages = chat.messages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice((page - 1) * limit, page * limit)
      .reverse(); // Reverse back to chronological order

    // Mark messages as read
    const updatedMessages = messages.map(msg => {
      if (!msg.readBy.includes(userId as any) && msg.sender.toString() !== userId) {
        msg.readBy.push(userId as any);
      }
      return msg;
    });

    if (updatedMessages.length > 0) {
      chat.messages = chat.messages.map(msg => {
        const updated = updatedMessages.find(um => um._id.equals(msg._id));
        return updated || msg;
      });
      await chat.save();
    }

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          hasMore: chat.messages.length > page * limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/chat/rooms/:roomId/messages
// @desc    Send message to chat room
// @access  Private
router.post('/rooms/:roomId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const { content, messageType, attachments } = req.body;
    const userId = (req as any).user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    const chat = await Chat.findOne({ roomId, isActive: true });
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    // Verify user is participant
    if (!chat.participants.includes(userId as any)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to send messages to this chat'
      });
    }

    // Add message
    const message = {
      _id: new mongoose.Types.ObjectId(),
      sender: userId,
      content,
      messageType: messageType || 'text',
      timestamp: new Date(),
      readBy: [userId], // Sender has read their own message
      attachments: attachments || []
    };

    chat.messages.push(message);
    await chat.save();

    // Populate sender info for response
    await chat.populate('messages.sender', 'firstName lastName profile.avatar');

    const newMessage = chat.messages[chat.messages.length - 1];

    logger.info(`Message sent in room ${roomId} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: { message: newMessage }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/chat/rooms/:roomId/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/rooms/:roomId/messages/:messageId/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, messageId } = req.params;
    const userId = (req as any).user.userId;

    const chat = await Chat.findOne({ roomId, isActive: true });
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    // Verify user is participant
    if (!chat.participants.includes(userId as any)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this chat'
      });
    }

    // Find and update message
    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    if (!message.readBy.includes(userId as any)) {
      message.readBy.push(userId as any);
      await chat.save();
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/chat/rooms/:roomId/messages/:messageId
// @desc    Edit message
// @access  Private (message sender only)
router.put('/rooms/:roomId/messages/:messageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, messageId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    const chat = await Chat.findOne({ roomId, isActive: true });
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Only sender can edit
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Can only edit your own messages'
      });
    }

    // Can only edit text messages
    if (message.messageType !== 'text') {
      return res.status(400).json({
        success: false,
        error: 'Can only edit text messages'
      });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();

    await chat.save();

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/chat/rooms/:roomId/messages/:messageId
// @desc    Delete message
// @access  Private (message sender only)
router.delete('/rooms/:roomId/messages/:messageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, messageId } = req.params;
    const userId = (req as any).user.userId;

    const chat = await Chat.findOne({ roomId, isActive: true });
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Can only delete your own messages'
      });
    }

    chat.messages.pull(messageId);
    await chat.save();

    logger.info(`Message deleted from room ${roomId} by user ${userId}`);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
