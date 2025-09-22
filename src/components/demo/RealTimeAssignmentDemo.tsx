import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RealTimeAssignmentDemo: React.FC = () => {
  const { user } = useAuth();
  const [lastAssignment, setLastAssignment] = useState<string>('');
  const [demoStep, setDemoStep] = useState(1);

  const simulateAssignment = () => {
    setDemoStep(2);
    
    setTimeout(() => {
      setDemoStep(3);
      setLastAssignment(`Student "Emma Wilson" assigned to Instructor "John Smith" at ${new Date().toLocaleTimeString()}`);
      
      // Show notification for demo
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('DriveConnect UK', {
          body: 'New student assignment completed!',
          icon: '/favicon.ico'
        });
      }
      
      setTimeout(() => {
        setDemoStep(1);
      }, 3000);
    }, 2000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('DriveConnect UK', {
          body: 'Notifications enabled! You will receive real-time updates.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const getStepContent = () => {
    switch (demoStep) {
      case 1:
        return (
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to Demo Real-Time Assignments
            </h3>
            <p className="text-gray-600 mb-4">
              Click the button below to simulate a student assignment and see real-time notifications in action.
            </p>
            <button
              onClick={simulateAssignment}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🚀 Assign Student (Demo)
            </button>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Processing Assignment...
            </h3>
            <p className="text-gray-600">
              Sending real-time notifications to instructor and student
            </p>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Assignment Completed!
            </h3>
            <p className="text-gray-600 mb-4">
              {lastAssignment}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">
                📱 Real-time notifications sent to all parties
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Real-Time Assignment Demo
            </h2>
            <p className="text-gray-600 text-sm">
              Experience live notifications and Socket.IO integration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>User Authenticated:</span>
            <span className={user ? 'text-green-600' : 'text-red-600'}>
              {user ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Socket.IO Ready:</span>
            <span className="text-green-600">✅ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Notifications:</span>
            <span className="text-blue-600">
              {Notification.permission === 'granted' ? '✅ Enabled' : '⚙️ Click to enable'}
            </span>
          </div>
        </div>
      </div>

      {/* Enable Notifications */}
      {Notification.permission !== 'granted' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <h4 className="font-medium text-yellow-800">Enable Browser Notifications</h4>
          </div>
          <p className="text-yellow-700 text-sm mb-3">
            Allow notifications to receive real-time assignment updates even when the tab is not active.
          </p>
          <button
            onClick={requestNotificationPermission}
            className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition-colors"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* Demo Content */}
      <div className="min-h-32 flex items-center justify-center">
        {getStepContent()}
      </div>

      {/* Recent Activity */}
      {lastAssignment && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Recent Assignment</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">{lastAssignment}</p>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium text-gray-900 mb-3">Real-Time Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Instant assignment notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Live status updates</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Browser notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Role-based messaging</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAssignmentDemo;