import React, { useState } from 'react';

const FormManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  
  // Mock form submissions data
  const submissions = [
    {
      id: 1,
      formType: 'learner_inquiry',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+44 7700 900123',
      message: 'I would like to start driving lessons in Manchester area.',
      status: 'new',
      submissionDate: '2024-01-20T10:30:00Z',
      assignedTo: null,
      followUpDate: null,
      source: 'website'
    },
    {
      id: 2,
      formType: 'instructor_inquiry',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+44 7700 900456',
      message: 'Experienced ADI looking to join your platform.',
      status: 'contacted',
      submissionDate: '2024-01-19T14:15:00Z',
      assignedTo: 'Admin User',
      followUpDate: '2024-01-22',
      source: 'landing_page'
    },
    {
      id: 3,
      formType: 'contact',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+44 7700 900789',
      message: 'Question about pricing and availability.',
      status: 'converted',
      submissionDate: '2024-01-18T09:45:00Z',
      assignedTo: 'Admin User',
      followUpDate: null,
      source: 'website'
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      converted: 'bg-green-100 text-green-800',
      spam: 'bg-red-100 text-red-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getFormTypeBadge = (formType: string) => {
    const badges = {
      learner_inquiry: 'bg-purple-100 text-purple-800',
      instructor_inquiry: 'bg-indigo-100 text-indigo-800',
      contact: 'bg-gray-100 text-gray-800',
      newsletter: 'bg-green-100 text-green-800',
      booking_request: 'bg-orange-100 text-orange-800'
    };
    return badges[formType as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const handleSelectSubmission = (id: number) => {
    setSelectedSubmissions(prev => 
      prev.includes(id) 
        ? prev.filter(submissionId => submissionId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === submissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(submissions.map(s => s.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Management</h1>
          <p className="text-gray-600">Manage visitor inquiries and form submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <i className="bi bi-download mr-2"></i>
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-file-earmark-text text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Submissions</p>
              <p className="text-3xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-exclamation-circle text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">68%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-graph-up text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-3xl font-bold text-gray-900">2.4h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-clock text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'submissions', label: 'Form Submissions', count: 23 },
              { id: 'templates', label: 'Email Templates', count: 8 },
              { id: 'settings', label: 'Form Settings', count: null }
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
                {tab.count && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="p-6">
            {/* Filters and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>All Form Types</option>
                  <option>Learner Inquiries</option>
                  <option>Instructor Inquiries</option>
                  <option>Contact Forms</option>
                  <option>Newsletter Signups</option>
                </select>

                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>All Statuses</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Converted</option>
                  <option>Archived</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              {selectedSubmissions.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedSubmissions.length} selected
                  </span>
                  <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Mark as Contacted
                  </button>
                  <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Archive
                  </button>
                </div>
              )}
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.length === submissions.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Form Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Info</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Message</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedSubmissions.includes(submission.id)}
                          onChange={() => handleSelectSubmission(submission.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormTypeBadge(submission.formType)}`}>
                          {submission.formType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{submission.name}</p>
                          <p className="text-sm text-gray-600">{submission.email}</p>
                          <p className="text-sm text-gray-600">{submission.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">
                          {submission.message}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(submission.submissionDate).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-800">
                            <i className="bi bi-envelope"></i>
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-800">
                            <i className="bi bi-three-dots"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing 1 to 3 of 247 submissions
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="text-center py-12">
              <i className="bi bi-envelope text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Templates</h3>
              <p className="text-gray-600 mb-4">Manage automated email responses and templates</p>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Create Template
              </button>
            </div>
          </div>
        )}

        {/* Form Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <div className="text-center py-12">
              <i className="bi bi-gear text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Form Settings</h3>
              <p className="text-gray-600 mb-4">Configure form behavior and validation rules</p>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Configure Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormManagement;