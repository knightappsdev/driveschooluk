import { db } from '../utils/database';
import { logger } from '../utils/logger';
import { EmailService } from './emailService';
import { SocketServer } from '../socket/socketServer';
import { UserRole } from '@prisma/client';

export interface NotificationData {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  userId?: string;
  userRole?: UserRole;
  actionUrl?: string;
  metadata?: Record<string, any>;
  scheduledAt?: Date;
  priority: NotificationPriority;
}

export enum NotificationType {
  LESSON_REMINDER = 'lesson_reminder',
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_CANCELLATION = 'booking_cancellation',
  AVAILABILITY_CHANGE = 'availability_change',
  INSTRUCTOR_ASSIGNMENT = 'instructor_assignment',
  PAYMENT_REMINDER = 'payment_reminder',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  PROGRESS_UPDATE = 'progress_update',
  DOCUMENT_UPLOADED = 'document_uploaded',
  TEST_RESULT = 'test_result'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface ScheduledNotification {
  id: string;
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  scheduledAt: Date;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
  sent: boolean;
  createdAt: Date;
}

export class NotificationService {
  private static instance: NotificationService;
  private socketServer?: SocketServer;
  private emailService: EmailService;
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.emailService = new EmailService();
    this.startNotificationScheduler();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setSocketServer(socketServer: SocketServer) {
    this.socketServer = socketServer;
  }

  // Send immediate notification
  async sendNotification(notification: NotificationData): Promise<void> {
    try {
      // Store notification in database
      const savedNotification = await this.saveNotification(notification);

      // Send real-time notification via Socket.IO
      if (this.socketServer && notification.userId) {
        this.socketServer.sendToUser(notification.userId, 'notification', {
          id: savedNotification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          actionUrl: notification.actionUrl,
          metadata: notification.metadata,
          priority: notification.priority,
          createdAt: savedNotification.createdAt
        });
      }

      // Send email for high priority notifications
      if (notification.priority === NotificationPriority.HIGH || 
          notification.priority === NotificationPriority.URGENT) {
        await this.sendEmailNotification(notification);
      }

      logger.info(`Notification sent: ${notification.type} to user ${notification.userId}`);
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  // Schedule notification for future delivery
  async scheduleNotification(notification: NotificationData): Promise<string> {
    try {
      if (!notification.scheduledAt) {
        throw new Error('scheduledAt is required for scheduled notifications');
      }

      const savedNotification = await this.saveScheduledNotification(notification);
      
      // Calculate delay
      const delay = notification.scheduledAt.getTime() - Date.now();
      
      if (delay > 0) {
        // Schedule the notification
        const timeoutId = setTimeout(async () => {
          await this.sendNotification({
            ...notification,
            id: savedNotification.id
          });
          
          // Mark as sent
          await this.markNotificationAsSent(savedNotification.id);
          this.scheduledNotifications.delete(savedNotification.id);
        }, delay);

        this.scheduledNotifications.set(savedNotification.id, timeoutId);
      } else {
        // Send immediately if scheduled time has passed
        await this.sendNotification(notification);
        await this.markNotificationAsSent(savedNotification.id);
      }

      return savedNotification.id;
    } catch (error) {
      logger.error('Error scheduling notification:', error);
      throw error;
    }
  }

  // Cancel scheduled notification
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
      const timeout = this.scheduledNotifications.get(notificationId);
      if (timeout) {
        clearTimeout(timeout);
        this.scheduledNotifications.delete(notificationId);
      }

      await db.scheduledNotification.update({
        where: { id: notificationId },
        data: { cancelled: true }
      });

      logger.info(`Scheduled notification cancelled: ${notificationId}`);
    } catch (error) {
      logger.error('Error cancelling scheduled notification:', error);
      throw error;
    }
  }

  // Send lesson reminders
  async sendLessonReminder(bookingId: string, reminderType: 'day_before' | 'two_hours' | 'thirty_minutes'): Promise<void> {
    try {
      const booking = await db.lessonBooking.findUnique({
        where: { id: bookingId },
        include: {
          learner: { include: { user: true } },
          instructor: { include: { user: true } }
        }
      });

      if (!booking) {
        throw new Error(`Booking not found: ${bookingId}`);
      }

      const reminderMessages = {
        day_before: {
          title: 'Lesson Reminder - Tomorrow',
          message: `Don't forget your driving lesson tomorrow at ${new Date(booking.scheduledAt).toLocaleTimeString()}`,
          priority: NotificationPriority.MEDIUM
        },
        two_hours: {
          title: 'Lesson Reminder - 2 Hours',
          message: `Your driving lesson starts in 2 hours at ${new Date(booking.scheduledAt).toLocaleTimeString()}`,
          priority: NotificationPriority.HIGH
        },
        thirty_minutes: {
          title: 'Lesson Starting Soon',
          message: `Your driving lesson starts in 30 minutes! Please be ready.`,
          priority: NotificationPriority.HIGH
        }
      };

      const reminder = reminderMessages[reminderType];

      // Send to learner
      await this.sendNotification({
        type: NotificationType.LESSON_REMINDER,
        title: reminder.title,
        message: reminder.message,
        userId: booking.learner.userId,
        actionUrl: `/dashboard/bookings/${bookingId}`,
        metadata: { 
          bookingId,
          reminderType,
          scheduledAt: booking.scheduledAt
        },
        priority: reminder.priority
      });

      // Send to instructor
      await this.sendNotification({
        type: NotificationType.LESSON_REMINDER,
        title: `Lesson Reminder - ${booking.learner.user.firstName} ${booking.learner.user.lastName}`,
        message: `Upcoming lesson with ${booking.learner.user.firstName} ${reminder.message.toLowerCase()}`,
        userId: booking.instructor.userId,
        actionUrl: `/dashboard/schedule/${bookingId}`,
        metadata: { 
          bookingId,
          reminderType,
          scheduledAt: booking.scheduledAt
        },
        priority: reminder.priority
      });

    } catch (error) {
      logger.error('Error sending lesson reminder:', error);
      throw error;
    }
  }

  // Send booking confirmation
  async sendBookingConfirmation(bookingId: string): Promise<void> {
    try {
      const booking = await db.lessonBooking.findUnique({
        where: { id: bookingId },
        include: {
          learner: { include: { user: true } },
          instructor: { include: { user: true } }
        }
      });

      if (!booking) {
        throw new Error(`Booking not found: ${bookingId}`);
      }

      // Send to learner
      await this.sendNotification({
        type: NotificationType.BOOKING_CONFIRMATION,
        title: 'Lesson Booked Successfully',
        message: `Your lesson with ${booking.instructor.user.firstName} ${booking.instructor.user.lastName} is confirmed for ${new Date(booking.scheduledAt).toLocaleString()}`,
        userId: booking.learner.userId,
        actionUrl: `/dashboard/bookings/${bookingId}`,
        metadata: { bookingId },
        priority: NotificationPriority.HIGH
      });

      // Send to instructor
      await this.sendNotification({
        type: NotificationType.BOOKING_CONFIRMATION,
        title: 'New Lesson Booking',
        message: `New lesson booking from ${booking.learner.user.firstName} ${booking.learner.user.lastName} for ${new Date(booking.scheduledAt).toLocaleString()}`,
        userId: booking.instructor.userId,
        actionUrl: `/dashboard/schedule/${bookingId}`,
        metadata: { bookingId },
        priority: NotificationPriority.HIGH
      });

      // Schedule automatic reminders
      await this.scheduleAutomaticReminders(booking);

    } catch (error) {
      logger.error('Error sending booking confirmation:', error);
      throw error;
    }
  }

  // Schedule automatic lesson reminders
  async scheduleAutomaticReminders(booking: any): Promise<void> {
    const lessonDate = new Date(booking.scheduledAt);
    
    // Schedule day before reminder
    const dayBeforeReminder = new Date(lessonDate.getTime() - 24 * 60 * 60 * 1000);
    if (dayBeforeReminder > new Date()) {
      setTimeout(async () => {
        await this.sendLessonReminder(booking.id, 'day_before');
      }, dayBeforeReminder.getTime() - Date.now());
    }

    // Schedule 2 hours before reminder
    const twoHoursBeforeReminder = new Date(lessonDate.getTime() - 2 * 60 * 60 * 1000);
    if (twoHoursBeforeReminder > new Date()) {
      setTimeout(async () => {
        await this.sendLessonReminder(booking.id, 'two_hours');
      }, twoHoursBeforeReminder.getTime() - Date.now());
    }

    // Schedule 30 minutes before reminder
    const thirtyMinutesBeforeReminder = new Date(lessonDate.getTime() - 30 * 60 * 1000);
    if (thirtyMinutesBeforeReminder > new Date()) {
      setTimeout(async () => {
        await this.sendLessonReminder(booking.id, 'thirty_minutes');
      }, thirtyMinutesBeforeReminder.getTime() - Date.now());
    }
  }

  // Send availability change notification
  async sendAvailabilityChangeNotification(instructorId: string, changes: any): Promise<void> {
    try {
      // Notify affected learners who have bookings
      const affectedBookings = await db.lessonBooking.findMany({
        where: {
          instructorId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          scheduledAt: { gte: new Date() }
        },
        include: {
          learner: { include: { user: true } }
        }
      });

      for (const booking of affectedBookings) {
        await this.sendNotification({
          type: NotificationType.AVAILABILITY_CHANGE,
          title: 'Instructor Availability Updated',
          message: 'Your instructor has updated their availability. Please check your upcoming lessons.',
          userId: booking.learner.userId,
          actionUrl: `/dashboard/bookings`,
          metadata: { instructorId, changes },
          priority: NotificationPriority.MEDIUM
        });
      }

      logger.info(`Availability change notifications sent for instructor: ${instructorId}`);
    } catch (error) {
      logger.error('Error sending availability change notification:', error);
      throw error;
    }
  }

  // Send system announcement
  async sendSystemAnnouncement(title: string, message: string, targetRole?: UserRole): Promise<void> {
    try {
      const whereClause = targetRole ? { role: targetRole } : {};
      
      const users = await db.user.findMany({
        where: {
          ...whereClause,
          status: 'ACTIVE'
        },
        select: { id: true }
      });

      for (const user of users) {
        await this.sendNotification({
          type: NotificationType.SYSTEM_ANNOUNCEMENT,
          title,
          message,
          userId: user.id,
          priority: NotificationPriority.MEDIUM
        });
      }

      logger.info(`System announcement sent to ${users.length} users`);
    } catch (error) {
      logger.error('Error sending system announcement:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string, limit: number = 20): Promise<any[]> {
    try {
      return await db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      logger.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await db.notification.update({
        where: { id: notificationId },
        data: { read: true, readAt: new Date() }
      });
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  private async saveNotification(notification: NotificationData): Promise<any> {
    return await db.notification.create({
      data: {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        userId: notification.userId!,
        actionUrl: notification.actionUrl || null,
        metadata: notification.metadata ? JSON.stringify(notification.metadata) : null,
        priority: notification.priority,
        read: false
      }
    });
  }

  private async saveScheduledNotification(notification: NotificationData): Promise<any> {
    return await db.scheduledNotification.create({
      data: {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        userId: notification.userId!,
        scheduledAt: notification.scheduledAt!,
        actionUrl: notification.actionUrl || null,
        priority: notification.priority,
        metadata: notification.metadata ? JSON.stringify(notification.metadata) : null,
        sent: false,
        cancelled: false
      }
    });
  }

  private async markNotificationAsSent(notificationId: string): Promise<void> {
    await db.scheduledNotification.update({
      where: { id: notificationId },
      data: { sent: true, sentAt: new Date() }
    });
  }

  private async sendEmailNotification(notification: NotificationData): Promise<void> {
    try {
      if (!notification.userId) return;

      const user = await db.user.findUnique({
        where: { id: notification.userId },
        select: { email: true, firstName: true, lastName: true }
      });

      if (!user) return;

      await this.emailService.sendNotificationEmail(
        user.email,
        user.firstName,
        notification.title,
        notification.message,
        notification.actionUrl
      );
    } catch (error) {
      logger.error('Error sending email notification:', error);
    }
  }

  private startNotificationScheduler(): void {
    // Check for pending scheduled notifications every 5 minutes
    setInterval(async () => {
      try {
        const pendingNotifications = await db.scheduledNotification.findMany({
          where: {
            sent: false,
            cancelled: false,
            scheduledAt: { lte: new Date() }
          }
        });

        for (const notification of pendingNotifications) {
          const notificationData: NotificationData = {
            id: notification.id,
            type: notification.type as NotificationType,
            title: notification.title,
            message: notification.message,
            userId: notification.userId,
            metadata: notification.metadata ? JSON.parse(notification.metadata as string) : undefined,
            priority: notification.priority as NotificationPriority
          };
          
          if (notification.actionUrl) {
            notificationData.actionUrl = notification.actionUrl;
          }
          
          await this.sendNotification(notificationData);

          await this.markNotificationAsSent(notification.id);
        }
      } catch (error) {
        logger.error('Error in notification scheduler:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}

export const notificationService = NotificationService.getInstance();