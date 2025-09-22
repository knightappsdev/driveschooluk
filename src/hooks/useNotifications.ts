import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }

    return newNotification.id;
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id && !notification.read
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const newNotifications = prev.filter(n => n.id !== id);
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return newNotifications;
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // Socket event handlers
  useEffect(() => {
    const handleSocketNotification = (...args: unknown[]) => {
      const data = args[0] as { title?: string; message?: string; type?: 'info' | 'success' | 'warning' | 'error' };
      addNotification({
        title: data?.title || 'New Notification',
        message: data?.message || 'You have a new notification',
        type: (data?.type && ['info', 'success', 'warning', 'error'].includes(data.type)) ? data.type : 'info'
      });
    };

    const handleAssignmentNotification = (...args: unknown[]) => {
      const data = args[0] as { message?: string };
      addNotification({
        title: 'New Assignment',
        message: data?.message || 'You have been assigned a new student',
        type: 'success'
      });
    };

    const handleLessonReminder = (...args: unknown[]) => {
      const data = args[0] as { message?: string };
      addNotification({
        title: 'Lesson Reminder',
        message: data?.message || 'You have an upcoming lesson',
        type: 'info'
      });
    };

    // Register socket listeners
    socketService.on('notification', handleSocketNotification);
    socketService.on('assignment_notification', handleAssignmentNotification);
    socketService.on('lesson_reminder', handleLessonReminder);

    // Cleanup on unmount
    return () => {
      socketService.off('notification', handleSocketNotification);
      socketService.off('assignment_notification', handleAssignmentNotification);
      socketService.off('lesson_reminder', handleLessonReminder);
    };
  }, [addNotification]);

  // Initialize with demo notifications
  useEffect(() => {
    const initDemoNotifications = () => {
      addNotification({
        title: 'Welcome to DriveConnect UK!',
        message: 'Your real-time notification system is now active.',
        type: 'success'
      });
    };

    // Add demo notification after a short delay
    const timer = setTimeout(initDemoNotifications, 2000);
    return () => clearTimeout(timer);
  }, [addNotification]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addNotification({
          title: 'Notifications Enabled',
          message: 'You will now receive real-time notifications!',
          type: 'success'
        });
      }
      return permission;
    }
    return Notification.permission;
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getNotificationsByType,
    getUnreadNotifications,
    requestPermission,
    hasPermission: typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  };
};

export default useNotifications;