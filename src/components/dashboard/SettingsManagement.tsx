import React, { useState } from 'react';

const SettingsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'DriveConnect UK',
    siteUrl: 'https://driveconnect.uk',
    adminEmail: 'admin@driveconnect.uk',
    autoApprovalLearners: true,
    manualApprovalInstructors: true,
    maxAdvanceBookingDays: 30,
    defaultLessonDuration: 60,
    cancellationWindow: 24,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true
  });

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In real app, this would make an API call to save settings
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system preferences and operational parameters</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <i className="bi bi-check-lg mr-2"></i>
          Save Changes
        </button>
      </div>

      {/* Settings Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General', icon: 'bi-gear' },
              { id: 'booking', label: 'Booking Rules', icon: 'bi-calendar-check' },
              { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
              { id: 'security', label: 'Security', icon: 'bi-shield-check' },
              { id: 'integrations', label: 'Integrations', icon: 'bi-plug' }
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
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Display name for your driving school platform</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Primary domain for your website</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Primary contact email for administrative notifications</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Europe/London (GMT)</option>
                    <option>Europe/Dublin (GMT)</option>
                    <option>UTC</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Default time zone for the platform</p>
                </div>
              </div>

              {/* Registration Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Registration Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Auto-approve learner registrations</p>
                      <p className="text-xs text-gray-500">Automatically approve new learner sign-ups without manual review</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoApprovalLearners}
                        onChange={(e) => handleSettingChange('autoApprovalLearners', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manual instructor approval</p>
                      <p className="text-xs text-gray-500">Require administrator approval for new instructor applications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.manualApprovalInstructors}
                        onChange={(e) => handleSettingChange('manualApprovalInstructors', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Rules Settings */}
          {activeTab === 'booking' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Booking Rules & Policies</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum advance booking (days)
                  </label>
                  <input
                    type="number"
                    value={settings.maxAdvanceBookingDays}
                    onChange={(e) => handleSettingChange('maxAdvanceBookingDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="1"
                    max="365"
                  />
                  <p className="text-xs text-gray-500 mt-1">How far in advance can lessons be booked</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default lesson duration (minutes)
                  </label>
                  <select 
                    value={settings.defaultLessonDuration}
                    onChange={(e) => handleSettingChange('defaultLessonDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Standard lesson duration for new bookings</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation window (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.cancellationWindow}
                    onChange={(e) => handleSettingChange('cancellationWindow', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="1"
                    max="168"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum notice required for cancellations</p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email notifications</p>
                    <p className="text-xs text-gray-500">Send email notifications for bookings, cancellations, and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS notifications</p>
                    <p className="text-xs text-gray-500">Send SMS reminders for upcoming lessons</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Marketing emails</p>
                    <p className="text-xs text-gray-500">Allow marketing and promotional emails to users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.marketingEmails}
                      onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab === 'security' && (
            <div className="text-center py-12">
              <i className="bi bi-shield-check text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
              <p className="text-gray-600 mb-4">Security and authentication settings will be configured here</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Password policies and requirements</p>
                <p>• Two-factor authentication settings</p>
                <p>• Session timeout configuration</p>
                <p>• API key management</p>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="text-center py-12">
              <i className="bi bi-plug text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Third-party Integrations</h3>
              <p className="text-gray-600 mb-4">Configure external service integrations</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Payment gateway settings (Stripe, PayPal)</p>
                <p>• Email service providers (SendGrid, Mailgun)</p>
                <p>• SMS service configuration</p>
                <p>• Google Maps API integration</p>
                <p>• Analytics and tracking tools</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;