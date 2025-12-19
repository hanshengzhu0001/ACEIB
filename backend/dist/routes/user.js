"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role;
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
        const query = {};
        if (role)
            query.role = role;
        if (isActive !== undefined)
            query.isActive = isActive;
        const users = await User_1.default.find(query)
            .select('-password -engagement -studentProfile -mentorProfile')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await User_1.default.countDocuments(query);
        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalUsers: count,
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
// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        // Users can only view basic info of other users, not sensitive data
        const currentUserId = req.user.userId;
        const isOwnProfile = currentUserId === req.params.id;
        const isAdmin = req.user.role === 'admin';
        let userData;
        if (isOwnProfile || isAdmin) {
            // Return full profile for own profile or admin
            userData = user;
        }
        else {
            // Return limited profile for other users
            userData = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profile: {
                    avatar: user.profile.avatar,
                    bio: user.profile.bio,
                    location: user.profile.location,
                    languages: user.profile.languages
                },
                engagement: {
                    averageRating: user.engagement.averageRating,
                    totalSessions: user.engagement.totalSessions
                }
            };
        }
        res.json({
            success: true,
            data: { user: userData }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (own profile or admin)
router.put('/:id', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';
        const targetUserId = req.params.id;
        // Users can only update their own profile unless they're admin
        if (userId !== targetUserId && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this profile'
            });
        }
        const allowedFields = [
            'firstName', 'lastName', 'profile', 'studentProfile', 'mentorProfile'
        ];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });
        const user = await User_1.default.findByIdAndUpdate(targetUserId, updates, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        logger_1.logger.info(`User profile updated: ${user.email}`);
        res.json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   PUT /api/users/:id/engagement
// @desc    Update user engagement data
// @access  Private (own profile or admin)
router.put('/:id/engagement', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';
        const targetUserId = req.params.id;
        // Users can only update their own engagement unless they're admin
        if (userId !== targetUserId && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update engagement data'
            });
        }
        const { action } = req.body; // 'login', 'session_complete', etc.
        const user = await User_1.default.findById(targetUserId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        const now = new Date();
        const lastActivity = user.engagement.lastActivity;
        const daysSinceLastActivity = lastActivity ?
            Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)) : 1;
        // Update engagement based on action
        if (action === 'login' || action === 'activity') {
            user.engagement.lastActivity = now;
            if (daysSinceLastActivity === 1) {
                // Consecutive day - increment streak
                user.engagement.currentStreak += 1;
                if (user.engagement.currentStreak > user.engagement.longestStreak) {
                    user.engagement.longestStreak = user.engagement.currentStreak;
                }
            }
            else if (daysSinceLastActivity > 1) {
                // Streak broken - reset to 1
                user.engagement.currentStreak = 1;
            }
            // If same day, don't change streak
        }
        else if (action === 'session_complete') {
            user.engagement.totalSessions += 1;
        }
        await user.save();
        res.json({
            success: true,
            data: {
                engagement: user.engagement
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   DELETE /api/users/:id
// @desc    Deactivate user account
// @access  Private/Admin
router.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Only administrators can deactivate accounts'
            });
        }
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        logger_1.logger.info(`User account deactivated: ${user.email}`);
        res.json({
            success: true,
            message: 'User account deactivated successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
// @route   GET /api/users/stats/overview
// @desc    Get user statistics overview
// @access  Private/Admin
router.get('/stats/overview', async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin';
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }
        const [totalUsers, activeUsers, mentorCount, studentCount, avgStreak] = await Promise.all([
            User_1.default.countDocuments(),
            User_1.default.countDocuments({ isActive: true }),
            User_1.default.countDocuments({ role: 'mentor', isActive: true }),
            User_1.default.countDocuments({ role: 'student', isActive: true }),
            User_1.default.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: null, avgStreak: { $avg: '$engagement.currentStreak' } } }
            ])
        ]);
        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers,
                mentorCount,
                studentCount,
                adminCount: totalUsers - mentorCount - studentCount,
                averageStreak: avgStreak[0]?.avgStreak || 0
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map