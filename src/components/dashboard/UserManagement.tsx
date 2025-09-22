import React, { useState } from 'react';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('learners');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage learners and instructors on your platform</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <i className="bi bi-plus mr-2"></i>
          Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'learners', label: 'Learners', count: 1247 },
              { id: 'instructors', label: 'Instructors', count: 89 },
              { id: 'pending', label: 'Pending Approvals', count: 7 }
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
            <i className="bi bi-people text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management System</h3>
            <p className="text-gray-600 mb-4">Advanced user management features will be implemented here</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Learner registration and profile management</p>
              <p>• Instructor approval and verification system</p>
              <p>• User activity tracking and analytics</p>
              <p>• Bulk operations and data export</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;