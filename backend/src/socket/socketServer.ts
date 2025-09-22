import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { JWTService } from '../utils/jwt';
import { db } from '../utils/database';
import { logger } from '../utils/logger';
import { UserRole } from '@prisma/client';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
}

export class SocketServer {
  private io: SocketIOServer;
  
  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupAuthentication();
    this.setupEventHandlers();
    
    logger.info('📡 Socket.IO server initialized');
  }

  private setupAuthentication() {
    this.io.use(async (socket: any, next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const payload = JWTService.verifyAccessToken(token);
        
        // Verify user exists and is active
        const user = await db.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            status: true,
          },
        });

        if (!user || user.status === 'SUSPENDED' || user.status === 'INACTIVE') {
          return next(new Error('Invalid user or account status'));
        }

        socket.user = user;
        next();
      } catch (error) {
        logger.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      logger.info(`🔌 User connected: ${socket.user?.email} (${socket.user?.role})`);
      
      // Join user to their role-based room
      if (socket.user) {
        socket.join(`user-${socket.user.id}`);
        socket.join(`role-${socket.user.role}`);
        
        // Join instructor to instructor room for assignments
        if (socket.user.role === UserRole.INSTRUCTOR) {
          socket.join('instructors');
        }
        
        // Join admins to admin room for system notifications
        if (socket.user.role === UserRole.SUPER_ADMIN || socket.user.role === UserRole.ADMIN) {
          socket.join('admins');
        }
      }

      // Handle assignment-related events
      this.handleAssignmentEvents(socket);
      
      // Handle lesson-related events
      this.handleLessonEvents(socket);
      
      // Handle notification events
      this.handleNotificationEvents(socket);
      
      // Handle messaging events
      this.handleMessagingEvents(socket);

      socket.on('disconnect', () => {
        logger.info(`🔌 User disconnected: ${socket.user?.email}`);
      });
    });
  }

  private handleAssignmentEvents(socket: AuthenticatedSocket) {
    // Client requests to join assignment room
    socket.on('join-assignment', async (assignmentId: string) => {
      try {
        const assignment = await db.assignment.findUnique({
          where: { id: assignmentId },
          include: {
            learner: { include: { user: true } },
            instructor: { include: { user: true } },
          },
        });

        if (!assignment) {
          socket.emit('error', { message: 'Assignment not found' });
          return;
        }

        // Check if user has permission to join this assignment room
        const hasPermission = 
          socket.user?.id === assignment.learner.userId ||
          socket.user?.id === assignment.instructor.userId ||
          socket.user?.role === UserRole.SUPER_ADMIN ||
          socket.user?.role === UserRole.ADMIN;

        if (hasPermission) {
          socket.join(`assignment-${assignmentId}`);
          socket.emit('joined-assignment', { assignmentId });
          logger.info(`User ${socket.user?.email} joined assignment room: ${assignmentId}`);
        } else {
          socket.emit('error', { message: 'Permission denied' });
        }
      } catch (error) {
        logger.error('Join assignment error:', error);
        socket.emit('error', { message: 'Failed to join assignment' });
      }
    });

    // Client leaves assignment room
    socket.on('leave-assignment', (assignmentId: string) => {
      socket.leave(`assignment-${assignmentId}`);
      socket.emit('left-assignment', { assignmentId });
    });
  }

  private handleLessonEvents(socket: AuthenticatedSocket) {
    // Client requests to join lesson room
    socket.on('join-lesson', async (lessonId: string) => {
      try {
        const lesson = await db.lesson.findUnique({
          where: { id: lessonId },
          include: {
            learner: { include: { user: true } },
            instructor: { include: { user: true } },
          },
        });

        if (!lesson) {
          socket.emit('error', { message: 'Lesson not found' });
          return;
        }

        // Check permission
        const hasPermission = 
          socket.user?.id === lesson.learner.userId ||
          socket.user?.id === lesson.instructor.userId ||
          socket.user?.role === UserRole.SUPER_ADMIN ||
          socket.user?.role === UserRole.ADMIN;

        if (hasPermission) {
          socket.join(`lesson-${lessonId}`);
          socket.emit('joined-lesson', { lessonId });
        } else {
          socket.emit('error', { message: 'Permission denied' });
        }
      } catch (error) {
        logger.error('Join lesson error:', error);
        socket.emit('error', { message: 'Failed to join lesson' });
      }
    });

    // Handle lesson status updates
    socket.on('lesson-status-update', async (data: { lessonId: string; status: string; notes?: string }) => {
      try {
        // Only instructors can update lesson status
        if (socket.user?.role !== UserRole.INSTRUCTOR) {
          socket.emit('error', { message: 'Only instructors can update lesson status' });
          return;
        }

        const lesson = await db.lesson.findUnique({
          where: { id: data.lessonId },
          include: {
            instructor: { include: { user: true } },
          },
        });

        if (!lesson || lesson.instructor.userId !== socket.user.id) {
          socket.emit('error', { message: 'Permission denied or lesson not found' });
          return;
        }

        // Update lesson in database
        const updateData: any = {
          status: data.status as any,
          updatedAt: new Date(),
        };
        
        if (data.notes !== undefined) {
          updateData.instructorNotes = data.notes;
        }
        
        const updatedLesson = await db.lesson.update({
          where: { id: data.lessonId },
          data: updateData,
          include: {
            learner: { include: { user: true } },
            instructor: { include: { user: true } },
          },
        });

        // Broadcast to lesson room
        this.io.to(`lesson-${data.lessonId}`).emit('lesson-updated', {
          lesson: updatedLesson,
          updatedBy: socket.user,
        });

        // Create notification for learner
        await this.createNotification({
          userId: updatedLesson.learnerId,
          title: 'Lesson Status Updated',
          message: `Your lesson status has been updated to: ${data.status}`,
          type: 'LESSON',
          metadata: JSON.stringify({
            lessonId: data.lessonId,
            status: data.status,
            instructorName: `${lesson.instructor.user.firstName} ${lesson.instructor.user.lastName}`,
          }),
        });

      } catch (error) {
        logger.error('Lesson status update error:', error);
        socket.emit('error', { message: 'Failed to update lesson status' });
      }
    });
  }

  private handleNotificationEvents(socket: AuthenticatedSocket) {
    // Mark notification as read
    socket.on('mark-notification-read', async (notificationId: string) => {
      try {
        const notification = await db.notification.findUnique({
          where: { id: notificationId },
        });

        if (!notification || notification.userId !== socket.user?.id) {
          socket.emit('error', { message: 'Notification not found or permission denied' });
          return;
        }

        await db.notification.update({
          where: { id: notificationId },
          data: { status: 'READ' },
        });

        socket.emit('notification-read', { notificationId });
      } catch (error) {
        logger.error('Mark notification read error:', error);
        socket.emit('error', { message: 'Failed to mark notification as read' });
      }
    });

    // Get user notifications
    socket.on('get-notifications', async () => {
      try {
        if (!socket.user?.id) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }
        
        const notifications = await db.notification.findMany({
          where: { userId: socket.user.id },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });

        socket.emit('notifications', notifications);
      } catch (error) {
        logger.error('Get notifications error:', error);
        socket.emit('error', { message: 'Failed to get notifications' });
      }
    });
  }

  private handleMessagingEvents(socket: AuthenticatedSocket) {
    // Send message in assignment room
    socket.on('send-assignment-message', async (data: { 
      assignmentId: string; 
      message: string; 
      messageType?: 'text' | 'system' 
    }) => {
      try {
        // Verify user is part of assignment
        const assignment = await db.assignment.findUnique({
          where: { id: data.assignmentId },
          include: {
            learner: { include: { user: true } },
            instructor: { include: { user: true } },
          },
        });

        if (!assignment) {
          socket.emit('error', { message: 'Assignment not found' });
          return;
        }

        const hasPermission = 
          socket.user?.id === assignment.learner.userId ||
          socket.user?.id === assignment.instructor.userId ||
          socket.user?.role === UserRole.SUPER_ADMIN ||
          socket.user?.role === UserRole.ADMIN;

        if (!hasPermission) {
          socket.emit('error', { message: 'Permission denied' });
          return;
        }

        const messageData = {
          id: `msg-${Date.now()}`,
          assignmentId: data.assignmentId,
          message: data.message,
          messageType: data.messageType || 'text',
          sender: {
            id: socket.user?.id,
            name: `${socket.user?.firstName} ${socket.user?.lastName}`,
            role: socket.user?.role,
          },
          timestamp: new Date().toISOString(),
        };

        // Broadcast to assignment room
        this.io.to(`assignment-${data.assignmentId}`).emit('assignment-message', messageData);

        // Create notification for the other party
        const recipientId = socket.user?.id === assignment.learner.userId 
          ? assignment.instructor.userId 
          : assignment.learner.userId;

        await this.createNotification({
          userId: recipientId,
          title: 'New Message',
          message: `New message from ${socket.user?.firstName}: ${data.message.substring(0, 50)}...`,
          type: 'MESSAGE',
          metadata: JSON.stringify({
            assignmentId: data.assignmentId,
            senderId: socket.user?.id,
            senderName: `${socket.user?.firstName} ${socket.user?.lastName}`,
          }),
        });

      } catch (error) {
        logger.error('Send assignment message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
  }

  // Public methods for broadcasting events from other services
  public async broadcastAssignmentUpdate(assignmentId: string, assignment: any, event: string = 'assignment-updated') {
    this.io.to(`assignment-${assignmentId}`).emit(event, { assignment });
    logger.info(`📡 Broadcasted assignment update: ${assignmentId}`);
  }

  public async broadcastLessonUpdate(lessonId: string, lesson: any, event: string = 'lesson-updated') {
    this.io.to(`lesson-${lessonId}`).emit(event, { lesson });
    logger.info(`📡 Broadcasted lesson update: ${lessonId}`);
  }

  public async broadcastNotification(userId: string, notification: any) {
    // Send to specific user
    this.io.to(`user-${userId}`).emit('new-notification', notification);
    
    // Also send to user's role room for general notifications
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    if (user) {
      this.io.to(`role-${user.role}`).emit('role-notification', notification);
    }
    
    logger.info(`📡 Broadcasted notification to user: ${userId}`);
  }

  public async broadcastToRole(role: UserRole, event: string, data: any) {
    this.io.to(`role-${role}`).emit(event, data);
    logger.info(`📡 Broadcasted to role ${role}: ${event}`);
  }

  public async broadcastToAdmins(event: string, data: any) {
    this.io.to('admins').emit(event, data);
    logger.info(`📡 Broadcasted to admins: ${event}`);
  }

  public async broadcastToInstructors(event: string, data: any) {
    this.io.to('instructors').emit(event, data);
    logger.info(`📡 Broadcasted to instructors: ${event}`);
  }

  private async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    metadata?: string;
  }) {
    try {
      const notification = await db.notification.create({
        data,
      });

      // Broadcast the notification
      await this.broadcastNotification(data.userId, notification);

      return notification;
    } catch (error) {
      logger.error('Create notification error:', error);
      throw error;
    }
  }

  public getIO() {
    return this.io;
  }
}

// Singleton instance
let socketServer: SocketServer;

export const initializeSocketServer = (server: HTTPServer): SocketServer => {
  if (!socketServer) {
    socketServer = new SocketServer(server);
  }
  return socketServer;
};

export const getSocketServer = (): SocketServer => {
  if (!socketServer) {
    throw new Error('Socket server not initialized');
  }
  return socketServer;
};