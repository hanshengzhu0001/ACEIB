"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MediationTicket_1 = __importDefault(require("../models/MediationTicket"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// @route   POST /api/mediation/tickets
// @desc    Create a new mediation ticket
// @access  Private
router.post('/tickets', async (req, res, next) => {
    try {
        const { issueType, title, description, reported, relatedPairing, relatedChat } = req.body;
        const reporterId = req.user.userId;
        // Validate required fields
        if (!issueType || !title || !description || !reported) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        // Check if reported user exists
        const reportedUser = await User_1.default.findById(reported);
        if (!reportedUser) {
            return res.status(404).json({
                success: false,
                error: 'Reported user not found'
            });
        }
        // Create ticket
        const ticket = new MediationTicket_1.default({
            issueType,
            title,
            description,
            reporter: reporterId,
            reported,
            relatedPairing,
            relatedChat,
            statusHistory: [{
                    status: 'open',
                    changedBy: reporterId,
                    note: 'Ticket created'
                }]
        });
        await ticket.save();
        logger_1.logger.info(`Mediation ticket created: ${ticket.ticketNumber} - ${title}`);
        res.status(201).json({
            success: true,
            data: { ticket }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   GET /api/mediation/tickets
// @desc    Get mediation tickets (filtered by user role)
// @access  Private
router.get('/tickets', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;
        const status = req.query.status;
        const issueType = req.query.issueType;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let query = {};
        // Filter based on user role
        if (userRole === 'admin') {
            // Admins can see all tickets
        }
        else {
            // Users can only see tickets they're involved in
            query.$or = [
                { reporter: userId },
                { reported: userId },
                { assignedTo: userId }
            ];
        }
        if (status)
            query.status = status;
        if (issueType)
            query.issueType = issueType;
        const tickets = await MediationTicket_1.default.find(query)
            .populate('reporter', 'firstName lastName email')
            .populate('reported', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await MediationTicket_1.default.countDocuments(query);
        res.json({
            success: true,
            data: {
                tickets,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalTickets: count,
                    hasNext: page * limit < count,
                    hasPrev: page > 1
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   GET /api/mediation/tickets/:id
// @desc    Get single mediation ticket
// @access  Private
router.get('/tickets/:id', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;
        const ticket = await MediationTicket_1.default.findById(req.params.id)
            .populate('reporter', 'firstName lastName email')
            .populate('reported', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')
            .populate('resolution.resolvedBy', 'firstName lastName email')
            .populate('statusHistory.changedBy', 'firstName lastName')
            .populate('internalNotes.createdBy', 'firstName lastName');
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found'
            });
        }
        // Check permissions
        const isInvolved = [ticket.reporter, ticket.reported, ticket.assignedTo].some(id => id && id.toString() === userId);
        if (userRole !== 'admin' && !isInvolved) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this ticket'
            });
        }
        res.json({
            success: true,
            data: { ticket }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   PUT /api/mediation/tickets/:id/status
// @desc    Update ticket status
// @access  Private/Admin
router.put('/tickets/:id/status', async (req, res, next) => {
    try {
        const { status, note } = req.body;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const ticket = await MediationTicket_1.default.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found'
            });
        }
        // Only admins can update status
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Only administrators can update ticket status'
            });
        }
        ticket.status = status;
        ticket.statusHistory.push({
            status,
            changedBy: userId,
            changedAt: new Date(),
            note: note || `Status changed to ${status}`
        });
        await ticket.save();
        logger_1.logger.info(`Ticket ${ticket.ticketNumber} status updated to ${status}`);
        res.json({
            success: true,
            data: { ticket }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   PUT /api/mediation/tickets/:id/assign
// @desc    Assign ticket to admin
// @access  Private/Admin
router.put('/tickets/:id/assign', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Only administrators can assign tickets'
            });
        }
        const ticket = await MediationTicket_1.default.findByIdAndUpdate(req.params.id, {
            assignedTo: userId,
            status: 'in-review',
            $push: {
                statusHistory: {
                    status: 'in-review',
                    changedBy: userId,
                    note: 'Ticket assigned for review'
                }
            }
        }, { new: true });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found'
            });
        }
        res.json({
            success: true,
            data: { ticket }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   POST /api/mediation/tickets/:id/notes
// @desc    Add internal note to ticket
// @access  Private/Admin
router.post('/tickets/:id/notes', async (req, res, next) => {
    try {
        const { note } = req.body;
        const userId = req.user.userId;
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Only administrators can add internal notes'
            });
        }
        if (!note) {
            return res.status(400).json({
                success: false,
                error: 'Note content is required'
            });
        }
        const ticket = await MediationTicket_1.default.findByIdAndUpdate(req.params.id, {
            $push: {
                internalNotes: {
                    note,
                    createdBy: userId
                }
            }
        }, { new: true });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found'
            });
        }
        res.json({
            success: true,
            data: { ticket }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   PUT /api/mediation/tickets/:id/resolve
// @desc    Resolve ticket with final decision
// @access  Private/Admin
router.put('/tickets/:id/resolve', async (req, res, next) => {
    try {
        const { resolution, satisfactionRating, feedback } = req.body;
        const userId = req.user.userId;
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Only administrators can resolve tickets'
            });
        }
        if (!resolution) {
            return res.status(400).json({
                success: false,
                error: 'Resolution is required'
            });
        }
        const ticket = await MediationTicket_1.default.findByIdAndUpdate(req.params.id, {
            status: 'resolved',
            resolution: {
                resolvedBy: userId,
                resolution,
                resolvedAt: new Date(),
                satisfactionRating,
                feedback
            },
            $push: {
                statusHistory: {
                    status: 'resolved',
                    changedBy: userId,
                    note: 'Ticket resolved'
                }
            }
        }, { new: true });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found'
            });
        }
        logger_1.logger.info(`Ticket ${ticket.ticketNumber} resolved`);
        res.json({
            success: true,
            data: { ticket }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   GET /api/mediation/stats
// @desc    Get mediation statistics
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
    try {
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }
        const [totalTickets, openTickets, resolvedTickets, avgResolutionTime] = await Promise.all([
            MediationTicket_1.default.countDocuments(),
            MediationTicket_1.default.countDocuments({ status: 'open' }),
            MediationTicket_1.default.countDocuments({ status: 'resolved' }),
            MediationTicket_1.default.aggregate([
                { $match: { status: 'resolved', 'resolution.resolvedAt': { $exists: true } } },
                {
                    $project: {
                        resolutionTime: {
                            $divide: [
                                { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                                1000 * 60 * 60 * 24 // Convert to days
                            ]
                        }
                    }
                },
                { $group: { _id: null, avgTime: { $avg: '$resolutionTime' } } }
            ])
        ]);
        const issueTypeStats = await MediationTicket_1.default.aggregate([
            { $group: { _id: '$issueType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json({
            success: true,
            data: {
                totalTickets,
                openTickets,
                resolvedTickets,
                pendingTickets: totalTickets - openTickets - resolvedTickets,
                averageResolutionTime: avgResolutionTime[0]?.avgTime || 0,
                issueTypeBreakdown: issueTypeStats
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=mediation.js.map