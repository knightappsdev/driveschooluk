import React, { useState } from 'react';

const BookingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage lesson bookings and schedules</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <i className="bi bi-plus mr-2"></i>
          Create Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-3xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-calendar-check text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Lessons</p>
              <p className="text-3xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-clock text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
              <p className="text-3xl font-bold text-gray-900">3,421</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-check-circle text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancellation Rate</p>
              <p className="text-3xl font-bold text-gray-900">3.2%</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-x-circle text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Management Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'active', label: 'Active Bookings', count: 156 },
              { id: 'scheduled', label: 'Scheduled Lessons', count: 89 },
              { id: 'completed', label: 'Completed', count: 3421 },
              { id: 'cancelled', label: 'Cancelled', count: 45 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <i className="bi bi-calendar-check text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Management System</h3>
            <p className="text-gray-600 mb-4">Comprehensive booking and scheduling system will be implemented here</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Real-time lesson scheduling and calendar view</p>
              <p>• Instructor availability management</p>
              <p>• Automatic booking confirmations and reminders</p>
              <p>• Progress tracking and lesson notes</p>
              <p>• Payment integration and status tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;