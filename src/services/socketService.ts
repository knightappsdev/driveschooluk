import { io, Socket } from 'socket.io-client';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'lesson_reminder' | 'booking_confirmation' | 'system_announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: Record<string, any>;
  userId?: string;
  createdAt: string;
}

interface SocketEvent {
  event: string;
  data: unknown;
  timestamp: Date;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private authToken: string | null = null;
  private eventLog: SocketEvent[] = [];
  private notificationCallbacks: ((notification: NotificationData) => void)[] = [];

  async connect(token?: string): Promise<void> {
    try {
      // Disconnect if already connected
      if (this.socket && this.socket.connected) {
        this.socket.disconnect();
      }

      // Create new socket connection
      this.socket = io('http://localhost:3001', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      this.authToken = token || null;

      // Set up event listeners
      this.setupEventListeners();

      // Wait for connection
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.logEvent('connect', { socketId: this.socket!.id });
          console.log('✅ Socket.IO connected:', this.socket!.id);
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          clearTimeout(timeout);
          this.logEvent('connect_error', error);
          console.error('❌ Socket.IO connection error:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Socket.IO connection failed:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.authToken = null;
    console.log('🔌 Socket.IO disconnected');
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.logEvent('disconnect', { reason });
      console.log('🔌 Socket.IO disconnected:', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this.isConnected = true;
      this.logEvent('reconnect', { attemptNumber });
      console.log('🔄 Socket.IO reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_error', (error) => {
      this.logEvent('reconnect_error', error);
      console.error('🔄 Socket.IO reconnection error:', error);
    });

    // Handle notification events
    this.socket.on('notification', (notificationData: NotificationData) => {
      console.log('🔔 Notification received:', notificationData);
      this.notificationCallbacks.forEach(callback => {
        try {
          callback(notificationData);
        } catch (error) {
          console.error('Error in notification callback:', error);
        }
      });
    });

    // Log all incoming events for debugging
    this.socket.onAny((event, ...args) => {
      this.logEvent(event, args.length === 1 ? args[0] : args);
      console.log('📨 Socket.IO event received:', event, args);
    });
  }

  // Event listener management
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn('Socket not connected. Event listener not added for:', event);
    }
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
  }

  // Emit events to server
  emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      this.logEvent(`emit:${event}`, data);
      console.log('📤 Socket.IO event sent:', event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  // Room management
  joinRoom(room: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', { room });
      console.log('🏠 Joining room:', room);
    } else {
      console.warn('Socket not connected. Cannot join room:', room);
    }
  }

  leaveRoom(room: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', { room });
      console.log('🚪 Leaving room:', room);
    } else {
      console.warn('Socket not connected. Cannot leave room:', room);
    }
  }

  // Send message to room
  sendMessage(room: string, message: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('message', { room, message });
      console.log('💬 Message sent to room:', room, message);
    } else {
      console.warn('Socket not connected. Cannot send message to room:', room);
    }
  }

  // Connection status
  isConnectedToSocket(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get socket ID
  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  // Reconnect manually
  reconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connect(this.authToken || undefined);
  }

  // Update auth token
  updateAuthToken(token: string): void {
    this.authToken = token;
    if (this.socket && this.isConnected) {
      this.socket.emit('update_auth', { token });
    }
  }

  // Event logging
  private logEvent(event: string, data: any): void {
    this.eventLog.push({
      event,
      data,
      timestamp: new Date()
    });

    // Keep only last 100 events
    if (this.eventLog.length > 100) {
      this.eventLog = this.eventLog.slice(-100);
    }
  }

  // Get recent events for debugging
  getRecentEvents(limit: number = 10): SocketEvent[] {
    return this.eventLog.slice(-limit);
  }

  // Clear event history
  clearEventHistory(): void {
    this.eventLog = [];
  }

  // Demo methods for testing (can be removed in production)
  simulateAssignmentNotification(instructorId: string, studentName: string): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      title: 'New Student Assignment',
      message: `You have been assigned a new student: ${studentName}`,
      type: 'success',
      userId: instructorId
    };

    // Emit to server instead of local simulation
    this.emit('test_notification', notification);
  }

  simulateLessonReminder(userId: string, lessonDetails: string): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      title: 'Lesson Reminder',
      message: lessonDetails,
      type: 'info',
      priority: 'medium',
      userId,
      createdAt: new Date().toISOString()
    };

    // Emit to server instead of local simulation
    this.emit('test_notification', notification);
  }

  // Notification subscription methods
  subscribeToNotifications(callback: (notification: NotificationData) => void): void {
    this.notificationCallbacks.push(callback);
    console.log('🔔 Subscribed to notifications');
  }

  unsubscribeFromNotifications(callback: (notification: NotificationData) => void): void {
    const index = this.notificationCallbacks.indexOf(callback);
    if (index > -1) {
      this.notificationCallbacks.splice(index, 1);
      console.log('🔕 Unsubscribed from notifications');
    }
  }

  // Clear all notification callbacks
  clearNotificationSubscriptions(): void {
    this.notificationCallbacks = [];
    console.log('🔕 Cleared all notification subscriptions');
  }

  // Send notification acknowledgment
  acknowledgeNotification(notificationId: string): void {
    this.emit('notification_acknowledged', { id: notificationId });
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;