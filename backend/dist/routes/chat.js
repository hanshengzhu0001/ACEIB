"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Chat_1 = __importDefault(require("../models/Chat"));
const MentorStudentPairing_1 = __importDefault(require("../models/MentorStudentPairing"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// @route   POST /api/chat/rooms
// @desc    Create or get chat room for mentor-student pair
// @access  Private
router.post('/rooms', async (req, res, next) => {
    try {
        const { pairingId } = req.body;
        const userId = req.user.userId;
        if (!pairingId) {
            return res.status(400).json({
                success: false,
                error: 'Pairing ID is required'
            });
        }
        // Verify pairing exists and user is part of it
        const pairing = await MentorStudentPairing_1.default.findById(pairingId);
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
        let chat = await Chat_1.default.findOne({ roomId, isActive: true });
        if (!chat) {
            // Create new chat room
            chat = new Chat_1.default({
                roomId,
                participants: [pairing.mentor, pairing.student],
                pairingId
            });
            await chat.save();
            logger_1.logger.info(`Chat room created: ${roomId}`);
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
    }
    catch (error) {
        next(error);
    }
});
// @route   GET /api/chat/rooms
// @desc    Get user's chat rooms
// @access  Private
router.get('/rooms', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const chats = await Chat_1.default.find({
            participants: userId,
            isActive: true
        })
            .populate('participants', 'firstName lastName email profile.avatar')
            .populate('lastMessage.sender', 'firstName lastName')
            .sort({ updatedAt: -1 });
        // Add unread count for each chat
        const chatsWithUnread = chats.map(chat => {
            const unreadCount = chat.messages.filter(msg => !msg.readBy.includes(userId) &&
                msg.sender.toString() !== userId).length;
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
    }
    catch (error) {
        next(error);
    }
});
// @route   GET /api/chat/rooms/:roomId/messages
// @desc    Get messages for a chat room
// @access  Private
router.get('/rooms/:roomId/messages', async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const chat = await Chat_1.default.findOne({ roomId, isActive: true });
        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat room not found'
            });
        }
        // Verify user is participant
        if (!chat.participants.includes(userId)) {
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
            if (!msg.readBy.includes(userId) && msg.sender.toString() !== userId) {
                msg.readBy.push(userId);
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
    }
    catch (error) {
        next(error);
    }
});
// @route   POST /api/chat/rooms/:roomId/messages
// @desc    Send message to chat room
// @access  Private
router.post('/rooms/:roomId/messages', async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const { content, messageType, attachments } = req.body;
        const userId = req.user.userId;
        if (!content) {
            return res.status(400).json({
                success: false,
                error: 'Message content is required'
            });
        }
        const chat = await Chat_1.default.findOne({ roomId, isActive: true });
        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat room not found'
            });
        }
        // Verify user is participant
        if (!chat.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to send messages to this chat'
            });
        }
        // Add message
        const message = {
            _id: new mongoose_1.default.Types.ObjectId(),
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
        logger_1.logger.info(`Message sent in room ${roomId} by user ${userId}`);
        res.status(201).json({
            success: true,
            data: { message: newMessage }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   PUT /api/chat/rooms/:roomId/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/rooms/:roomId/messages/:messageId/read', async (req, res, next) => {
    try {
        const { roomId, messageId } = req.params;
        const userId = req.user.userId;
        const chat = await Chat_1.default.findOne({ roomId, isActive: true });
        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat room not found'
            });
        }
        // Verify user is participant
        if (!chat.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this chat'
            });
        }
        // Find and update message
        const messageIndex = chat.messages.findIndex(msg => msg._id.toString() === messageId);
        if (messageIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        const message = chat.messages[messageIndex];
        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId);
            await chat.save();
        }
        res.json({
            success: true,
            message: 'Message marked as read'
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   PUT /api/chat/rooms/:roomId/messages/:messageId
// @desc    Edit message
// @access  Private (message sender only)
router.put('/rooms/:roomId/messages/:messageId', async (req, res, next) => {
    try {
        const { roomId, messageId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;
        if (!content) {
            return res.status(400).json({
                success: false,
                error: 'Message content is required'
            });
        }
        const chat = await Chat_1.default.findOne({ roomId, isActive: true });
        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat room not found'
            });
        }
        const messageIndex = chat.messages.findIndex(msg => msg._id.toString() === messageId);
        if (messageIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        const message = chat.messages[messageIndex];
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
    }
    catch (error) {
        next(error);
    }
});
// @route   DELETE /api/chat/rooms/:roomId/messages/:messageId
// @desc    Delete message
// @access  Private (message sender only)
router.delete('/rooms/:roomId/messages/:messageId', async (req, res, next) => {
    try {
        const { roomId, messageId } = req.params;
        const userId = req.user.userId;
        const chat = await Chat_1.default.findOne({ roomId, isActive: true });
        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat room not found'
            });
        }
        const messageIndex = chat.messages.findIndex((msg) => msg._id.toString() === messageId);
        if (messageIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        const message = chat.messages[messageIndex];
        // Only sender can delete
        if (message.sender.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Can only delete your own messages'
            });
        }
        chat.messages.splice(messageIndex, 1);
        await chat.save();
        logger_1.logger.info(`Message deleted from room ${roomId} by user ${userId}`);
        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map