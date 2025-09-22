import React from 'react';

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeSection,
  setActiveSection,
  collapsed,
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'bi-grid-1x2',
      description: 'Dashboard overview and metrics'
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'bi-people',
      description: 'Manage learners and users'
    },
    {
      id: 'instructors',
      label: 'Instructors',
      icon: 'bi-person-badge',
      description: 'Manage instructors and assignments'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'bi-calendar-check',
      description: 'Lesson bookings and schedules'
    },
    {
      id: 'forms',
      label: 'Form Submissions',
      icon: 'bi-file-earmark-text',
      description: 'Visitor inquiries and registrations'
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: 'bi-layout-text-window-reverse',
      description: 'Edit website content and elements'
    },
    {
      id: 'learning-materials',
      label: 'Learning Materials',
      icon: 'bi-folder',
      description: 'Upload and manage learning resources'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'bi-gear',
      description: 'System configuration and preferences'
    },
    {
      id: 'realtime-demo',
      label: 'Real-Time Demo',
      icon: 'bi-broadcast',
      description: 'Live Socket.IO communication demo'
    }
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
        {/* Logo/Brand */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <i className="bi bi-car-front-fill text-white text-sm"></i>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">DriveConnect</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : ''}
            >
              <i className={`${item.icon} text-lg ${collapsed ? 'mx-auto' : 'mr-3'}`}></i>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <i className="bi bi-person-fill text-gray-600 text-sm"></i>
            </div>
            {!collapsed && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Profile
              </button>
              <button className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;