import React from 'react';

const DashboardOverview: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalLearners: 1247,
    totalInstructors: 89,
    activeBookings: 156,
    completedLessons: 3421,
    monthlyRevenue: 24750,
    conversionRate: 67.8,
    newInquiries: 23,
    pendingApprovals: 7
  };

  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      message: 'New lesson booking by Sarah Johnson',
      time: '5 minutes ago',
      icon: 'bi-calendar-plus',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'registration',
      message: 'Michael Brown registered as learner',
      time: '15 minutes ago',
      icon: 'bi-person-plus',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'completion',
      message: 'Emma Davis completed driving test',
      time: '1 hour ago',
      icon: 'bi-trophy',
      iconColor: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'approval',
      message: 'Instructor James Wilson approved',
      time: '2 hours ago',
      icon: 'bi-check-circle',
      iconColor: 'text-green-600'
    }
  ];

  const topInstructors = [
    {
      id: 1,
      name: 'David Thompson',
      rating: 4.9,
      completedLessons: 245,
      revenue: 12350
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      rating: 4.8,
      completedLessons: 198,
      revenue: 9890
    },
    {
      id: 3,
      name: 'Robert Clark',
      rating: 4.7,
      completedLessons: 167,
      revenue: 8350
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your driving school.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <i className="bi bi-download mr-2"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Learners</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLearners.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                <i className="bi bi-arrow-up mr-1"></i>
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-people text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Instructors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalInstructors}</p>
              <p className="text-sm text-green-600 mt-1">
                <i className="bi bi-arrow-up mr-1"></i>
                +5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-person-badge text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeBookings}</p>
              <p className="text-sm text-yellow-600 mt-1">
                <i className="bi bi-dash mr-1"></i>
                -3% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-calendar-check text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">£{stats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                <i className="bi bi-arrow-up mr-1"></i>
                +18% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-currency-pound text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Bookings</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Completions</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {/* Mock chart bars - replace with actual chart library */}
            {[65, 45, 78, 52, 89, 76, 69, 84, 58, 73, 91, 67].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '200px' }}>
                  <div 
                    className="w-full bg-primary-500 rounded-t absolute bottom-0"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div 
                    className="w-full bg-secondary-500 rounded-t absolute bottom-0 opacity-60"
                    style={{ height: `${Math.max(0, height - 20)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-semibold text-gray-900">{stats.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full" 
                  style={{ width: `${stats.conversionRate}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Lessons</span>
                <span className="text-sm font-semibold text-gray-900">{stats.completedLessons}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Inquiries</span>
                <span className="text-sm font-semibold text-gray-900">{stats.newInquiries}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Approvals</span>
                <span className="text-sm font-semibold text-red-600">{stats.pendingApprovals}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-800">View all</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.iconColor}`}>
                  <i className={`${activity.icon} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Instructors */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Instructors</h3>
            <button className="text-sm text-primary-600 hover:text-primary-800">View all</button>
          </div>
          <div className="space-y-4">
            {topInstructors.map((instructor, index) => (
              <div key={instructor.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">#{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{instructor.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>★ {instructor.rating}</span>
                    <span>•</span>
                    <span>{instructor.completedLessons} lessons</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">£{instructor.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;