import React, { useState } from 'react';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Mock content data
  const contentSections = {
    homepage: [
      {
        id: 'hero_title',
        label: 'Hero Section Title',
        value: 'Find Your Perfect Driving Instructor in the UK',
        type: 'text'
      },
      {
        id: 'hero_subtitle',
        label: 'Hero Section Subtitle', 
        value: 'Connect with qualified, experienced driving instructors in your area. Pass your test faster with personalized lessons tailored to your learning style.',
        type: 'textarea'
      },
      {
        id: 'stats_learners',
        label: 'Total Learners Stat',
        value: '2,500+',
        type: 'text'
      },
      {
        id: 'stats_pass_rate',
        label: 'Pass Rate Stat',
        value: '95%',
        type: 'text'
      },
      {
        id: 'stats_students',
        label: 'Happy Students Stat',
        value: '50,000+',
        type: 'text'
      }
    ],
    features: [
      {
        id: 'feature_1_title',
        label: 'Feature 1 Title',
        value: 'Qualified Instructors',
        type: 'text'
      },
      {
        id: 'feature_1_desc',
        label: 'Feature 1 Description',
        value: 'All our instructors are fully qualified ADI certified professionals',
        type: 'textarea'
      }
    ],
    courses: [
      {
        id: 'courses_title',
        label: 'Courses Section Title',
        value: 'Choose Your Perfect Course',
        type: 'text'
      }
    ]
  };

  const handleSave = (sectionId: string, newValue: string) => {
    // In real app, this would make an API call to save the content
    console.log(`Saving ${sectionId}: ${newValue}`);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Edit website content and frontend elements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <i className="bi bi-eye mr-2"></i>
            Preview Changes
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <i className="bi bi-cloud-upload mr-2"></i>
            Publish Changes
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'homepage', label: 'Homepage', icon: 'bi-house' },
              { id: 'features', label: 'Features', icon: 'bi-star' },
              { id: 'courses', label: 'Courses', icon: 'bi-book' },
              { id: 'testimonials', label: 'Testimonials', icon: 'bi-chat-quote' },
              { id: 'footer', label: 'Footer', icon: 'bi-layout-text-window-reverse' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Homepage Content */}
          {activeTab === 'homepage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Homepage Content</h3>
                <span className="text-sm text-gray-500">Last updated: 2 hours ago</span>
              </div>

              <div className="space-y-4">
                {contentSections.homepage.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        {section.label}
                      </label>
                      <button
                        onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        {editingSection === section.id ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    
                    {editingSection === section.id ? (
                      <div className="space-y-3">
                        {section.type === 'textarea' ? (
                          <textarea
                            defaultValue={section.value}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        ) : (
                          <input
                            type="text"
                            defaultValue={section.value}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        )}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSave(section.id, section.value)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded border">
                        {section.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Hero Section Preview */}
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Section Preview</h4>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {contentSections.homepage.find(s => s.id === 'hero_title')?.value}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {contentSections.homepage.find(s => s.id === 'hero_subtitle')?.value}
                    </p>
                    <div className="flex justify-center space-x-8">
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary-600">
                          {contentSections.homepage.find(s => s.id === 'stats_learners')?.value}
                        </div>
                        <div className="text-sm text-gray-600">Qualified Instructors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary-600">
                          {contentSections.homepage.find(s => s.id === 'stats_pass_rate')?.value}
                        </div>
                        <div className="text-sm text-gray-600">Pass Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary-600">
                          {contentSections.homepage.find(s => s.id === 'stats_students')?.value}
                        </div>
                        <div className="text-sm text-gray-600">Happy Students</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'homepage' && (
            <div className="text-center py-12">
              <i className="bi bi-layout-text-window-reverse text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content Management</h3>
              <p className="text-gray-600 mb-4">Content editing for {activeTab} section will be implemented here</p>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Add Content Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;