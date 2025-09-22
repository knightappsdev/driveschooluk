import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { logger } from './utils/logger';
import { db } from './utils/database';

// Import routes
import authRoutes from './routes/auth';
import instructorRoutes from './routes/instructors';
import formSubmissionRoutes from './routes/formSubmissions';
import uploadRoutes from './routes/upload';
import bookingRoutes from './routes/bookings';
import calendarRoutes from './routes/calendar';
// TODO: Fix TypeScript errors in new controllers
// import userRoutes from './routes/users';
// import bookingRoutes from './routes/bookings';
// import courseRoutes from './routes/courses';

// Import Socket.IO server
import { initializeSocketServer } from './socket/socketServer';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env['PORT'] || 3002;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX'] || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'],
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/form-submissions', formSubmissionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/calendar', calendarRoutes);
// TODO: Enable after fixing TypeScript errors
// app.use('/api/users', userRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/courses', courseRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    message: process.env['NODE_ENV'] === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env['NODE_ENV'] !== 'production' && { stack: err.stack }),
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Close database connection
  await db.$disconnect();
  
  // Disconnect Socket.IO if available
  if (socketServer) {
    socketServer.getIO().close();
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  // Close database connection
  await db.$disconnect();
  
  // Disconnect Socket.IO if available
  if (socketServer) {
    socketServer.getIO().close();
  }
  
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Initialize Socket.IO server
const socketServer = initializeSocketServer(server);
logger.info('📡 Socket.IO server initialized with real-time capabilities');
logger.info(`📡 Socket.IO server status: ${socketServer ? 'Ready' : 'Failed'}`);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 DriveConnect UK Backend API running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env['NODE_ENV']}`);
  logger.info(`🔗 CORS Origin: ${process.env['CORS_ORIGIN']}`);
  logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
  logger.info(`📡 Socket.IO available at ws://localhost:${PORT}`);
});

export default app;