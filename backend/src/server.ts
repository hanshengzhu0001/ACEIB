import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { connectDB } from './utils/database';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';
import { logger } from './utils/logger';
import { seedDatabase } from './utils/seedData';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import matchingRoutes from './routes/matching';
import mediationRoutes from './routes/mediation';
import chatRoutes from './routes/chat';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'ratings', 'price'] // Allow array parameters for these fields
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/matching', authenticate, matchingRoutes);
app.use('/api/mediation', authenticate, mediationRoutes);
app.use('/api/chat', authenticate, chatRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join', (userId: string) => {
    socket.join(userId);
    logger.info(`User ${userId} joined room`);
  });

  // Handle private messaging
  socket.on('private_message', (data: { to: string; message: string; from: string }) => {
    socket.to(data.to).emit('private_message', {
      from: data.from,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Handle mentor-student chat rooms
  socket.on('join_chat_room', (roomId: string) => {
    socket.join(roomId);
    logger.info(`User joined chat room: ${roomId}`);
  });

  socket.on('chat_message', (data: { roomId: string; message: string; senderId: string }) => {
    io.to(data.roomId).emit('chat_message', {
      senderId: data.senderId,
      message: data.message,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Seed database with mock data in development
    if (process.env.NODE_ENV !== 'production') {
      await seedDatabase();
    }

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Socket.io server initialized`);
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`🌱 Mock data seeded successfully`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, server, io };
