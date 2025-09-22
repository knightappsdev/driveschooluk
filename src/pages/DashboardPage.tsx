import React, { useState } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import UserManagement from '../components/dashboard/UserManagement';
import InstructorManagement from '../components/dashboard/InstructorManagement';
import BookingManagement from '../components/dashboard/BookingManagement';
import FormManagement from '../components/dashboard/FormManagement';
import ContentManagement from '../components/dashboard/ContentManagement';
import SettingsManagement from '../components/dashboard/SettingsManagement';
import RealTimeAssignmentDemo from '../components/demo/RealTimeAssignmentDemo';
import { LearningMaterials } from './LearningMaterials';

const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'users':
        return <UserManagement />;
      case 'instructors':
        return <InstructorManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'forms':
        return <FormManagement />;
      case 'content':
        return <ContentManagement />;
      case 'learning-materials':
        return <LearningMaterials />;
      case 'settings':
        return <SettingsManagement />;
      case 'realtime-demo':
        return <RealTimeAssignmentDemo />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <DashboardHeader 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;