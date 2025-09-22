import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import socketService from '../../services/socketService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Handle incoming notifications
  const handleNewNotification = useCallback((notificationData: any) => {
    const newNotification: Notification = {
      id: notificationData.id || Date.now().toString(),
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      timestamp: new Date(notificationData.timestamp || Date.now()),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico'
      });
    }
  }, []);

  // Initialize Socket.IO connection and notifications
  useEffect(() => {
    if (user) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Connect to Socket.IO server
      const token = localStorage.getItem('auth_token');
      socketService.connect(token || undefined)
        .then(() => {
          console.log('Socket.IO connected successfully');
          
          // Join user-specific room
          socketService.joinRoom(`user_${user.id}`);
          
          // Join role-specific room
          socketService.joinRoom(`role_${user.role.toLowerCase()}`);
        })
        .catch((error) => {
          console.error('Failed to connect to Socket.IO:', error);
          // Fallback to demo notifications if socket connection fails
          const demoNotifications: Notification[] = [
            {
              id: '1',
              title: 'Welcome to DriveConnect UK',
              message: 'Socket.IO connection failed. Using demo notifications.',
              type: 'warning',
              timestamp: new Date(),
              read: false
            }
          ];
          setNotifications(demoNotifications);
          setUnreadCount(1);
        });

      // Set up event listeners
      socketService.on('notification', handleNewNotification);
      socketService.on('assignment_notification', handleNewNotification);
      socketService.on('lesson_reminder', handleNewNotification);
      socketService.on('lesson_update', handleNewNotification);
      socketService.on('system_update', handleNewNotification);

      // Load existing notifications from API if needed
      // TODO: Implement API call to fetch existing notifications
      
      return () => {
        // Cleanup socket listeners
        socketService.off('notification', handleNewNotification);
        socketService.off('assignment_notification', handleNewNotification);
        socketService.off('lesson_reminder', handleNewNotification);
        socketService.off('lesson_update', handleNewNotification);
        socketService.off('system_update', handleNewNotification);
        
        // Leave rooms
        socketService.leaveRoom(`user_${user.id}`);
        socketService.leaveRoom(`role_${user.role.toLowerCase()}`);
      };
    } else {
      // Disconnect if user logs out
      socketService.disconnect();
    }
  }, [user, handleNewNotification]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="mb-2">🔔</div>
                <p>No notifications yet</p>
                <p className="text-sm">You'll see real-time updates here when they happen</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-1">
                        {getTypeIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium text-sm ${getTypeColor(notification.type)}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>🟢 Live notifications active</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;