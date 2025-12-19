"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./utils/database");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
const logger_1 = require("./utils/logger");
const seedData_1 = require("./utils/seedData");
const auth_2 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const matching_1 = __importDefault(require("./routes/matching"));
const mediation_1 = __importDefault(require("./routes/mediation"));
const chat_1 = __importDefault(require("./routes/chat"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
// Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
// Data sanitization against NoSQL injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
// Prevent parameter pollution
app.use((0, hpp_1.default)({
    whitelist: ['duration', 'ratings', 'price'] // Allow array parameters for these fields
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_2.default);
app.use('/api/users', auth_1.authenticate, user_1.default);
app.use('/api/matching', auth_1.authenticate, matching_1.default);
app.use('/api/mediation', auth_1.authenticate, mediation_1.default);
app.use('/api/chat', auth_1.authenticate, chat_1.default);
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Socket.io connection handling
io.on('connection', (socket) => {
    logger_1.logger.info(`User connected: ${socket.id}`);
    // Join user to their personal room
    socket.on('join', (userId) => {
        socket.join(userId);
        logger_1.logger.info(`User ${userId} joined room`);
    });
    // Handle private messaging
    socket.on('private_message', (data) => {
        socket.to(data.to).emit('private_message', {
            from: data.from,
            message: data.message,
            timestamp: new Date()
        });
    });
    // Handle mentor-student chat rooms
    socket.on('join_chat_room', (roomId) => {
        socket.join(roomId);
        logger_1.logger.info(`User joined chat room: ${roomId}`);
    });
    socket.on('chat_message', (data) => {
        io.to(data.roomId).emit('chat_message', {
            senderId: data.senderId,
            message: data.message,
            timestamp: new Date()
        });
    });
    socket.on('disconnect', () => {
        logger_1.logger.info(`User disconnected: ${socket.id}`);
    });
});
const PORT = process.env.PORT || 3001;
// Connect to database and start server
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        // Seed database with mock data in development
        if (process.env.NODE_ENV !== 'production') {
            await (0, seedData_1.seedDatabase)();
        }
        server.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${PORT}`);
            logger_1.logger.info(`📡 Socket.io server initialized`);
            if (process.env.NODE_ENV !== 'production') {
                logger_1.logger.info(`🌱 Mock data seeded successfully`);
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map