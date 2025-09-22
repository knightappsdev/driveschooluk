import { Router, Response } from 'express';
import { NotificationService, NotificationType, NotificationPriority } from '../services/notificationService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { UserRole } from '@prisma/client';

const router = Router();
const notificationService = NotificationService.getInstance();

// Get user notifications
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const { limit = '20', page = '1' } = req.query;
    
    const notifications = await notificationService.getUserNotifications(
      userId, 
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: notifications.length
      }
    });
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notifications' 
    });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID is required'
      });
    }
    
    await notificationService.markAsRead(id);

    return res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to mark notification as read' 
    });
  }
});

// Send system announcement (Admin only)
router.post('/announcements', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    
    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ADMIN) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    const { title, message, targetRole } = req.body;

    if (!title || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and message are required' 
      });
    }

    await notificationService.sendSystemAnnouncement(
      title, 
      message, 
      targetRole as UserRole
    );

    return res.json({
      success: true,
      message: 'System announcement sent successfully'
    });
  } catch (error) {
    logger.error('Error sending system announcement:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send system announcement' 
    });
  }
});

// Send custom notification (Admin only)
router.post('/send', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    
    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ADMIN) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    const { 
      userId, 
      type, 
      title, 
      message, 
      actionUrl, 
      metadata, 
      priority = NotificationPriority.MEDIUM,
      scheduledAt 
    } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId, type, title, and message are required' 
      });
    }

    if (scheduledAt) {
      const notificationData = {
        type: type as NotificationType,
        title,
        message,
        userId,
        actionUrl,
        metadata,
        priority: priority as NotificationPriority,
        scheduledAt: new Date(scheduledAt)
      };
      const notificationId = await notificationService.scheduleNotification(notificationData);
      return res.json({
        success: true,
        message: 'Notification scheduled successfully',
        notificationId
      });
    } else {
      const notificationData = {
        type: type as NotificationType,
        title,
        message,
        userId,
        actionUrl,
        metadata,
        priority: priority as NotificationPriority
      };
      await notificationService.sendNotification(notificationData);
      return res.json({
        success: true,
        message: 'Notification sent successfully'
      });
    }
  } catch (error) {
    logger.error('Error sending notification:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send notification' 
    });
  }
});

// Cancel scheduled notification (Admin only)
router.delete('/scheduled/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    
    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ADMIN) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID is required'
      });
    }
    
    await notificationService.cancelScheduledNotification(id);

    return res.json({
      success: true,
      message: 'Scheduled notification cancelled successfully'
    });
  } catch (error) {
    logger.error('Error cancelling scheduled notification:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel scheduled notification' 
    });
  }
});

// Test notification endpoint (Admin only, for development)
router.post('/test', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, id: userId } = req.user!;
    
    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ADMIN) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    await notificationService.sendNotification({
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title: 'Test Notification',
      message: 'This is a test notification from the DriveConnect UK system.',
      userId,
      priority: NotificationPriority.LOW
    });

    return res.json({
      success: true,
      message: 'Test notification sent successfully'
    });
  } catch (error) {
    logger.error('Error sending test notification:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send test notification' 
    });
  }
});

export default router;