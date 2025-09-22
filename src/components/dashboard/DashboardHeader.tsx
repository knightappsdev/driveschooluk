import React from 'react';
import NotificationCenter from '../common/NotificationCenter';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar }) => {

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <i className="bi bi-list text-lg"></i>
        </button>
        
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your driving school platform</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <i className="bi bi-plus-circle mr-2"></i>
            Add User
          </button>
          
          <button className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
            <i className="bi bi-download mr-2"></i>
            Export Data
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Real-time Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <div className="flex items-center">
          <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <i className="bi bi-person-fill text-white text-sm"></i>
            </div>
            <i className="bi bi-chevron-down text-gray-500 ml-2"></i>
          </button>
        </div>
      </div>


    </header>
  );
};

export default DashboardHeader;